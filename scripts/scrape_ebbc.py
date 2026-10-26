#!/usr/bin/env python3
"""
EBBC Harvester & Scientometric Pipeline - BRAN Org Standard
Script de extração, auditoria e curadoria metodológica dos anais do
Encontro Brasileiro de Bibliometria e Cientometria (EBBC 2012 - 2026).

Extrai metadados públicos (título, autores, ano, resumo, palavras-chave, DOI)
e aplica taxonomia bibliométrica para identificar ferramentas e fontes de dados.
"""

import os
import sys
import json
import time
import re
import urllib.request
import urllib.error
from bs4 import BeautifulSoup

BASE_URL = "https://ebbc.inf.br"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (BRAN Org Harvester)"

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
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def clean_author_name(name):
    if not name:
        return ""
    # Remove sufixos como (Autor), (Author), etc.
    name = re.sub(r"\s*\([^)]*\)", "", name)
    name = re.sub(r"\s+", " ", name)
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

def fetch_url(url, retries=3, delay=1.0):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(delay * (attempt + 1))
            else:
                print(f"❌ Falha ao acessar {url}: {e}", file=sys.stderr)
                return None

def scrape_article(article_url, default_year=2026):
    html = fetch_url(article_url)
    if not html:
        return None
        
    soup = BeautifulSoup(html, "html.parser")
    
    # 1. Título
    title_meta = soup.find("meta", {"name": "citation_title"}) or soup.find("meta", {"name": "DC.Title"})
    title = clean_text(title_meta["content"]) if title_meta and title_meta.get("content") else ""
    if not title:
        h1 = soup.find("h1", class_="page_title")
        if h1:
            title = clean_text(h1.get_text())
            
    # 2. Autores
    author_metas = soup.find_all("meta", {"name": "citation_author"})
    if not author_metas:
        author_metas = soup.find_all("meta", {"name": "DC.Creator.PersonalName"})
    authors = []
    for am in author_metas:
        name = clean_author_name(am.get("content", ""))
        if name and name not in authors:
            authors.append(name)
            
    # Fallback autores se meta tags ausentes
    if not authors:
        authors_div = soup.find("div", class_="authors")
        if authors_div:
            parts = [clean_author_name(p) for p in re.split(r"[,;]", authors_div.get_text())]
            authors = [p for p in parts if p]

    # 3. Resumo
    desc_meta = soup.find("meta", {"name": "DC.Description"})
    abstract = clean_text(desc_meta["content"]) if desc_meta and desc_meta.get("content") else ""
    if not abstract:
        abs_sec = soup.find("section", class_="item abstract")
        if abs_sec:
            abstract = clean_text(abs_sec.get_text())
            
    # 4. Palavras-chave
    kw_metas = soup.find_all("meta", {"name": "citation_keywords"})
    keywords = []
    for km in kw_metas:
        content = km.get("content", "")
        # Separar por vírgula se agrupadas em uma única tag
        for part in re.split(r"[,;]", content):
            cw = clean_text(part)
            if cw and cw not in keywords:
                keywords.append(cw)
                
    if not keywords:
        dc_subj = soup.find_all("meta", {"name": "DC.Subject"})
        for sm in dc_subj:
            cw = clean_text(sm.get("content", ""))
            if cw and cw not in keywords:
                keywords.append(cw)

    # 5. DOI
    doi_meta = soup.find("meta", {"name": "citation_doi"}) or soup.find("meta", {"name": "DC.Identifier.DOI"})
    raw_doi = doi_meta.get("content", "").strip() if doi_meta else ""
    if raw_doi:
        if raw_doi.startswith("http"):
            doi = raw_doi
        else:
            doi = f"https://doi.org/{raw_doi}"
    else:
        # Extrair id da URL
        art_id = re.search(r"/article/view/(\d+)", article_url)
        doi = f"https://doi.org/10.22477/x.ebbc.{art_id.group(1)}" if art_id else "N/A"

    # 6. Ano
    date_meta = soup.find("meta", {"name": "citation_date"}) or soup.find("meta", {"name": "DC.Date.issued"})
    year = default_year
    if date_meta and date_meta.get("content"):
        m = re.search(r"\b(19\d\d|20\d\d)\b", date_meta["content"])
        if m:
            year = int(m.group(1))

    # 7. Facetas Cientométricas
    tools, data_sources = extract_scientometric_facets(abstract)
    identifies_tool = "Sim" if tools else "N/A"
    usage_stages = infer_usage_stages(abstract, tools)
    
    return {
        "doi": doi,
        "title": title,
        "year": year,
        "authors": authors,
        "keywords": keywords,
        "tools": tools,
        "identifies_tool": identifies_tool,
        "usage_stages": usage_stages,
        "data_sources": data_sources,
        "abstract": abstract,
        "is_refined": True
    }

def scrape_issue(issue_url, year=2026):
    print(f"🌐 Acessando sumário da edição: {issue_url} ...")
    html = fetch_url(issue_url)
    if not html:
        return []
        
    soup = BeautifulSoup(html, "html.parser")
    links = soup.find_all("a", href=re.compile(r"/article/view/\d+$"))
    unique_urls = list(dict.fromkeys([a["href"] for a in links]))
    print(f"📑 Total de artigos localizados na edição: {len(unique_urls)}")
    
    results = []
    total = len(unique_urls)
    for idx, url in enumerate(unique_urls, 1):
        print(f"   [{idx}/{total}] Coletando: {url} ...", end=" ", flush=True)
        art = scrape_article(url, default_year=year)
        if art and art.get("title") and art.get("authors"):
            results.append(art)
            print(f"✓ '{art['title'][:45]}...' ({len(art['authors'])} autores, DOI: {art['doi']})")
        else:
            print("⚠️ Registro incompleto ignorado.")
        time.sleep(0.1) # cortesia ao servidor OJS
        
    return results

def audit_dataset_integrity(articles):
    """Verifica e reporta métricas de qualidade do acervo extraído."""
    total = len(articles)
    with_doi = sum(1 for a in articles if a.get("doi") and a.get("doi") != "N/A")
    with_abstract = sum(1 for a in articles if a.get("abstract"))
    with_tools = sum(1 for a in articles if a.get("tools"))
    with_sources = sum(1 for a in articles if a.get("data_sources"))
    
    from collections import Counter
    years = Counter(a.get("year") for a in articles)
    
    print("=" * 65)
    print("📊 RELATÓRIO DE AUDITORIA DE EXTRAÇÃO - EBBC")
    print(f"  • Total de Artigos: {total}")
    print(f"  • Com DOI Registrado: {with_doi} ({(with_doi/total)*100:.1f}%)")
    print(f"  • Com Resumo Completo: {with_abstract} ({(with_abstract/total)*100:.1f}%)")
    print(f"  • Com Ferramentas Detectadas: {with_tools} ({(with_tools/total)*100:.1f}%)")
    print(f"  • Com Fontes de Dados Detectadas: {with_sources} ({(with_sources/total)*100:.1f}%)")
    print(f"  • Distribuição por Ano: {dict(sorted(years.items()))}")
    print("=" * 65)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(script_dir), "data")
    output_path = os.path.join(data_dir, "ebbc_articles.json")
    
    existing = []
    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
        print(f"📦 Acervo existente carregado de {output_path} ({len(existing)} artigos).")
    
    # URL da 10ª Edição (2026)
    issue_10_url = f"{BASE_URL}/ojs/index.php/ebbc/issue/view/15"
    print(f"\n🚀 Iniciando extração dos anais da 10ª Edição (EBBC 2026)...")
    new_articles = scrape_issue(issue_10_url, year=2026)
    print(f"\n✓ Coleta da 10ª edição concluída com {len(new_articles)} artigos extraídos.")
    
    # Mesclagem por DOI ou título
    seen_dois = {a.get("doi"): idx for idx, a in enumerate(existing) if a.get("doi") and a.get("doi") != "N/A"}
    seen_titles = {clean_text(a.get("title")).lower(): idx for idx, a in enumerate(existing) if a.get("title")}
    
    added_count = 0
    updated_count = 0
    
    for art in new_articles:
        doi = art.get("doi")
        title_key = clean_text(art.get("title")).lower()
        
        if doi and doi in seen_dois:
            existing[seen_dois[doi]] = art
            updated_count += 1
        elif title_key in seen_titles:
            existing[seen_titles[title_key]] = art
            updated_count += 1
        else:
            existing.append(art)
            if doi:
                seen_dois[doi] = len(existing) - 1
            seen_titles[title_key] = len(existing) - 1
            added_count += 1
            
    print(f"\n💾 Atualização do acervo: {added_count} novos adicionados, {updated_count} atualizados.")
    print(f"📦 Novo total no acervo: {len(existing)} artigos.")
    
    # Salvar dataset final
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    print(f"✓ Dataset canônico gravado em {output_path}.")
    
    # Auditoria
    audit_dataset_integrity(existing)

if __name__ == "__main__":
    main()
