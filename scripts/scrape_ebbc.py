#!/usr/bin/env python3
"""
EBBC Harvester & Scientometric Pipeline - BRAN Org Standard
Script de extração, auditoria e curadoria metodológica dos anais do
Encontro Brasileiro de Bibliometria e Cientometria (EBBC 2012 - 2026).

Consome a API oficial OAI-PMH do portal EBBC (OJS) para coletar metadados
completos (título, autores, ano, resumo, palavras-chave, DOI genuíno, URL da
página e link direto para o PDF) e aplica taxonomia cientométrica.
"""

import os
import sys
import json
import time
import re
import html
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

OAI_ENDPOINT = "https://ebbc.inf.br/ojs/index.php/ebbc/oai"
USER_AGENT = "BRAN-Org-Harvester/2.0 (+https://github.com/BRAN-Org/ebbc-open-database)"

# Dicionário de taxonomia para enriquecimento metodológico cientométrico
TOOLS_TAXONOMY = {
    "VOSviewer": [r"\bvosviewer\b", r"\bvos\s*viewer\b"],
    "CiteSpace": [r"\bcitespace\b"],
    "Gephi": [r"\bgephi\b"],
    "Bibliometrix": [r"\bbibliometrix\b", r"\bbiblioshiny\b"],
    "Pajek": [r"\bpajek\b"],
    "UCINET": [r"\bucinet\b"],
    "R": [r"\blinguagem\s+r\b", r"\bpacote\s+r\b", r"\bsoftware\s+r\b"],
    "Python": [r"\bpython\b", r"\bpandas\b", r"\bspacy\b"],
    "Excel": [r"\bexcel\b", r"\bms\s+excel\b"],
    "VantagePoint": [r"\bvantagepoint\b", r"\bvantage\s+point\b"],
    "SciMAT": [r"\bscimat\b", r"\bsci-mat\b"],
    "HistCite": [r"\bhistcite\b"],
    "SPSS": [r"\bspss\b"],
    "Iramuteq": [r"\biramuteq\b"]
}

DATA_SOURCES_TAXONOMY = {
    "Web of Science": [r"\bweb of science\b", r"\bwos\b"],
    "Scopus": [r"\bscopus\b"],
    "SciELO": [r"\bscielo\b"],
    "Plataforma Lattes": [r"\bplataforma lattes\b", r"\bcurr[ií]culos? lattes\b", r"\blattes\b"],
    "Google Acadêmico": [r"\bgoogle acad[eê]mico\b", r"\bgoogle scholar\b"],
    "Dimensions": [r"\bdimensions\b"],
    "PubMed": [r"\bpubmed\b"],
    "BRAPCI": [r"\bbrapci\b"],
    "BDTD": [r"\bbdtd\b"],
    "OpenAlex": [r"\bopenalex\b"]
}

def clean_text(text):
    if not text:
        return ""
    text = html.unescape(text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def sanitize_doi(raw_doi):
    if not raw_doi:
        return "N/A"
    cleaned = raw_doi.strip()
    if cleaned.upper() in ["N/A", "NA", "NONE", "NULL", ""]:
        return "N/A"
    cleaned = re.sub(r"^https?://(dx\.)?doi\.org/", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"^doi:\s*", "", cleaned, flags=re.IGNORECASE).strip()
    if re.match(r"^10\.\d{4,9}/[-._;()/:,A-Za-z0-9]+$", cleaned):
        return f"https://doi.org/{cleaned}"
    return "N/A"

def clean_author_name(name):
    if not name:
        return ""
    name = html.unescape(name)
    name = re.sub(r"<[^>]+>", "", name)
    name = re.sub(r"\s*\([^)]*\)", "", name)
    name = re.sub(r"\s+", " ", name).strip()
    # Inverter "Sobrenome, Nome" -> "Nome Sobrenome"
    if "," in name:
        parts = [p.strip() for p in name.split(",", 1)]
        if len(parts) == 2 and parts[1]:
            name = f"{parts[1]} {parts[0]}"
        elif len(parts) == 1:
            name = parts[0]
    return name.strip()

def extract_scientometric_facets(text):
    """Identifica ferramentas e fontes de dados mencionadas no texto do resumo."""
    tools_found = []
    sources_found = []
    
    if not text:
        return tools_found, sources_found
        
    lower_text = text.lower()
    
    for tool, patterns in TOOLS_TAXONOMY.items():
        for pattern in patterns:
            if re.search(pattern, lower_text, re.IGNORECASE):
                tools_found.append(tool)
                break
                
    for source, patterns in DATA_SOURCES_TAXONOMY.items():
        for pattern in patterns:
            if re.search(pattern, lower_text, re.IGNORECASE):
                sources_found.append(source)
                break
                
    return sorted(list(set(tools_found))), sorted(list(set(sources_found)))

def infer_usage_stages(abstract, tools):
    if not tools:
        return []
    lower = abstract.lower() if abstract else ""
    stages = ["análise dos dados"]
    if re.search(r"\bcoleta\b", lower):
        stages.append("coleta dos dados")
    if re.search(r"\b(visualiza[çc][ãa]o|gr[áa]fico|grafo|mapa|rede)\b", lower):
        stages.append("visualização - gerar gráficos")
    return stages

def fetch_oai_page(url, retries=3, delay=1.0):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read()
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(delay * (attempt + 1))
            else:
                print(f"❌ Falha ao acessar OAI ({url}): {e}", file=sys.stderr)
                return None

def harvest_ebbc_oai():
    print(f"🌐 Conectando à API OAI-PMH oficial: {OAI_ENDPOINT} ...")
    ns = {
        "oai": "http://www.openarchives.org/OAI/2.0/",
        "dc": "http://purl.org/dc/elements/1.1/"
    }
    
    url = f"{OAI_ENDPOINT}?verb=ListRecords&metadataPrefix=oai_dc"
    harvested = []
    page = 1
    
    while url:
        xml_data = fetch_oai_page(url)
        if not xml_data:
            break
            
        root = ET.fromstring(xml_data)
        recs = root.findall(".//oai:record", ns)
        page_items = 0
        
        for rec in recs:
            header = rec.find("oai:header", ns)
            if header is not None and header.get("status") == "deleted":
                continue
                
            meta = rec.find(".//oai:metadata", ns)
            if meta is None:
                continue
                
            oai_id = header.find("oai:identifier", ns).text if header.find("oai:identifier", ns) is not None else ""
            art_id_match = re.search(r"article/(\d+)", oai_id)
            art_id = art_id_match.group(1) if art_id_match else ""
            
            title_el = meta.find(".//dc:title", ns)
            title = clean_text(title_el.text) if title_el is not None else ""
            if not title or len(title) < 3:
                continue
                
            creators = [clean_author_name(el.text) for el in meta.findall(".//dc:creator", ns) if el.text]
            creators = [c for c in creators if c]
            if not creators:
                continue
                
            raw_subjects = [clean_text(el.text) for el in meta.findall(".//dc:subject", ns) if el.text]
            keywords = []
            for s in raw_subjects:
                for part in re.split(r"[,;]", s):
                    p = clean_text(part)
                    if p and p not in keywords:
                        keywords.append(p)
                        
            desc_el = meta.find(".//dc:description", ns)
            abstract = clean_text(desc_el.text) if desc_el is not None else ""
            if abstract.lower() == "sem resumo":
                abstract = ""
                
            date_el = meta.find(".//dc:date", ns)
            date_str = date_el.text if date_el is not None else ""
            
            source_els = [clean_text(el.text) for el in meta.findall(".//dc:source", ns) if el.text]
            source_text = " ".join(source_els)
            
            # Extrair ano e edição
            year = 2024
            y_match = re.search(r"\((\d{4})\)", source_text) or re.search(r"\b(20\d\d|19\d\d)\b", date_str)
            if y_match:
                year = int(y_match.group(1))
                
            edition = "N/A"
            ed_match = re.search(r"v\.\s*(\d+)", source_text) or re.search(r"(\d+)º\s+Encontro", source_text)
            if ed_match:
                edition = f"{ed_match.group(1)}ª Edição"
                
            idents = [clean_text(el.text) for el in meta.findall(".//dc:identifier", ns) if el.text]
            relations = [clean_text(el.text) for el in meta.findall(".//dc:relation", ns) if el.text]
            
            article_url = ""
            raw_doi = ""
            for i in idents:
                if "/article/view/" in i:
                    article_url = i
                elif "10." in i and not raw_doi:
                    raw_doi = i
            doi = sanitize_doi(raw_doi)
                    
            pdf_url = ""
            for r in relations:
                if "/article/view/" in r or "/article/download/" in r:
                    pdf_url = r.replace("/article/view/", "/article/download/")
                    break
                    
            if not pdf_url and article_url and art_id:
                pdf_url = f"https://ebbc.inf.br/ojs/index.php/ebbc/article/download/{art_id}/{art_id}"
                    
            tools, data_sources = extract_scientometric_facets(abstract)
            identifies_tool = "Sim" if tools else "N/A"
            usage_stages = infer_usage_stages(abstract, tools)
            
            canonical_id = f"ebbc-{year}-{art_id}" if art_id else f"ebbc-{year}-{len(harvested)+1}"
            
            harvested.append({
                "id": canonical_id,
                "doi": doi,
                "title": title,
                "year": year,
                "authors": creators,
                "keywords": keywords,
                "abstract": abstract,
                "url": article_url or None,
                "pdf_url": pdf_url or None,
                "event_name": "Encontro Brasileiro de Bibliometria e Cientometria",
                "edition": edition,
                "tools": tools,
                "identifies_tool": identifies_tool,
                "usage_stages": usage_stages,
                "data_sources": data_sources,
                "is_refined": True
            })
            page_items += 1
            
        token_el = root.find(".//oai:resumptionToken", ns)
        if token_el is not None and token_el.text and token_el.text.strip():
            print(f"   ✓ Página {page}: +{page_items} artigos colhidos (total parcial: {len(harvested)})...")
            url = f"{OAI_ENDPOINT}?verb=ListRecords&resumptionToken={token_el.text.strip()}"
            page += 1
            time.sleep(0.2)
        else:
            print(f"   ✓ Página {page}: +{page_items} artigos colhidos. Coleta concluída.")
            break
            
    print(f"📊 Total bruto colhido via OAI-PMH: {len(harvested)} trabalhos.")
    return harvested

def merge_with_existing(harvested, existing_path):
    existing_map = {}
    if os.path.exists(existing_path):
        try:
            with open(existing_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            for item in data:
                key = clean_text(item.get("title", "")).lower()
                if key:
                    existing_map[key] = item
            print(f"📦 Carregados {len(existing_map)} registros legados de referência.")
        except Exception as e:
            print(f"⚠️ Aviso ao ler acervo legado: {e}")
            
    merged = []
    seen = set()
    
    for h in harvested:
        norm_title = clean_text(h["title"]).lower()
        if norm_title in seen:
            continue
        seen.add(norm_title)
        
        # Se houver metadados mais completos no legado (ex: resumo ausente no OAI)
        legacy = existing_map.get(norm_title)
        if legacy:
            if h["doi"] == "N/A" and legacy.get("doi"):
                h["doi"] = sanitize_doi(legacy["doi"])
            if not h["abstract"] and legacy.get("abstract"):
                h["abstract"] = legacy["abstract"]
                tools, sources = extract_scientometric_facets(h["abstract"])
                h["tools"] = tools
                h["data_sources"] = sources
                h["identifies_tool"] = "Sim" if tools else "N/A"
                h["usage_stages"] = infer_usage_stages(h["abstract"], tools)
                
            for kw in legacy.get("keywords", []):
                if kw not in h["keywords"]:
                    h["keywords"].append(kw)
                    
        merged.append(h)
        
    # Ordenar por ano decrescente e título crescente
    merged.sort(key=lambda x: (-x.get("year", 0), x.get("title", "")))
    return merged

def audit_dataset(articles):
    total = len(articles)
    with_pdf = sum(1 for a in articles if a.get("pdf_url"))
    with_url = sum(1 for a in articles if a.get("url"))
    with_doi = sum(1 for a in articles if a.get("doi") and a.get("doi") != "N/A")
    with_abs = sum(1 for a in articles if a.get("abstract"))
    with_kw = sum(1 for a in articles if a.get("keywords"))
    with_tools = sum(1 for a in articles if a.get("tools"))
    
    print("=" * 65)
    print("📊 RELATÓRIO DE AUDITORIA DE EXTRAÇÃO OAI-PMH - EBBC")
    print(f"  • Total de Artigos: {total}")
    print(f"  • Com URL do PDF: {with_pdf} ({(with_pdf/total)*100:.1f}%)")
    print(f"  • Com URL Oficial: {with_url} ({(with_url/total)*100:.1f}%)")
    print(f"  • Com DOI Genuíno: {with_doi} ({(with_doi/total)*100:.1f}%)")
    print(f"  • Com Resumo: {with_abs} ({(with_abs/total)*100:.1f}%)")
    print(f"  • Com Palavras-chave: {with_kw} ({(with_kw/total)*100:.1f}%)")
    print(f"  • Com Ferramentas Detectadas: {with_tools} ({(with_tools/total)*100:.1f}%)")
    print("=" * 65)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    data_dir = os.path.join(project_dir, "data")
    output_path = os.path.join(data_dir, "ebbc_articles.json")
    
    harvested = harvest_ebbc_oai()
    consolidated = merge_with_existing(harvested, output_path)
    
    os.makedirs(data_dir, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(consolidated, f, indent=2, ensure_ascii=False)
        f.write("\n")
        
    print(f"💾 Dataset canônico gravado com sucesso em: {output_path}")
    audit_dataset(consolidated)

if __name__ == "__main__":
    main()
