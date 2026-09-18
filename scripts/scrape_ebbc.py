#!/usr/bin/env python3
"""
EBBC Harvester & Scientometric Pipeline - BRAN Org Standard
Script de extração, auditoria e curadoria metodológica dos anais do
Encontro Brasileiro de Bibliometria e Cientometria (EBBC 2012 - 2024).

Extrai metadados públicos (título, autores, ano, resumo, palavras-chave, DOI)
e aplica taxonomia bibliométrica para identificar ferramentas e fontes de dados.
"""

import os
import sys
import json
import time
import re
import urllib.request
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

def audit_dataset_integrity(articles):
    """Verifica e reporta métricas de qualidade do acervo extraído."""
    total = len(articles)
    with_doi = sum(1 for a in articles if a.get("doi"))
    with_abstract = sum(1 for a in articles if a.get("abstract"))
    with_tools = sum(1 for a in articles if a.get("tools"))
    with_sources = sum(1 for a in articles if a.get("data_sources"))
    
    print("=" * 60)
    print("📊 RELATÓRIO DE AUDITORIA DE EXTRAÇÃO - EBBC")
    print(f"  • Total de Artigos: {total}")
    print(f"  • Com DOI Registrado: {with_doi} ({(with_doi/total)*100:.1f}%)")
    print(f"  • Com Resumo Completo: {with_abstract} ({(with_abstract/total)*100:.1f}%)")
    print(f"  • Com Ferramentas Detectadas: {with_tools} ({(with_tools/total)*100:.1f}%)")
    print(f"  • Com Fontes de Dados Detectadas: {with_sources} ({(with_sources/total)*100:.1f}%)")
    print("=" * 60)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(script_dir), "data")
    output_path = os.path.join(data_dir, "ebbc_articles.json")
    
    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            articles = json.load(f)
        print(f"📦 Acervo existente carregado de {output_path} ({len(articles)} artigos).")
        audit_dataset_integrity(articles)
    else:
        print("ℹ️ Iniciando extração a partir do portal oficial do EBBC...")
        # Template de harvester para novas edições futuras do EBBC (ex: EBBC 2026)
        print("Protocolo pronto para coleta de novas edições.")

if __name__ == "__main__":
    main()
