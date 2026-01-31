#!/usr/bin/env python3
"""
PDF Generator for HRMS Architecture Documentation
Converts Markdown to professional academic-style PDF
"""

import markdown2
from weasyprint import HTML, CSS
from pathlib import Path
import os

def generate_pdf():
    """Generate PDF from markdown architecture document"""
    
    # Paths
    artifacts_dir = Path("/home/petpooja-1118/.gemini/antigravity/brain/b51ee9f5-9262-4579-a93b-6904e5632841")
    md_file = artifacts_dir / "SYSTEM_ARCHITECTURE.md"
    pdf_file = artifacts_dir / "HRMS_System_Architecture.pdf"
    
    # Read markdown content
    print(f"Reading markdown from: {md_file}")
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Convert markdown to HTML
    print("Converting markdown to HTML...")
    html_content = markdown2.markdown(
        md_content,
        extras=[
            'fenced-code-blocks',
            'tables',
            'header-ids',
            'toc',
            'code-friendly',
            'break-on-newline'
        ]
    )
    
    # Academic CSS styling
    css_content = """
    @page {
        size: A4;
        margin: 2.5cm 2cm;
        
        @top-center {
            content: "AI-Powered HRMS System Architecture";
            font-size: 9pt;
            color: #666;
            font-family: 'Georgia', serif;
        }
        
        @bottom-center {
            content: "Page " counter(page) " of " counter(pages);
            font-size: 9pt;
            color: #666;
        }
    }
    
    @page :first {
        @top-center { content: none; }
        @bottom-center { content: none; }
    }
    
    body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #333;
        text-align: justify;
        hyphens: auto;
    }
    
    h1 {
        font-size: 24pt;
        font-weight: bold;
        color: #1a1a1a;
        margin-top: 30pt;
        margin-bottom: 20pt;
        page-break-after: avoid;
        border-bottom: 3px solid #2563eb;
        padding-bottom: 10pt;
    }
    
    h2 {
        font-size: 18pt;
        font-weight: bold;
        color: #2563eb;
        margin-top: 25pt;
        margin-bottom: 15pt;
        page-break-after: avoid;
    }
    
    h3 {
        font-size: 14pt;
        font-weight: bold;
        color: #1e40af;
        margin-top: 20pt;
        margin-bottom: 12pt;
        page-break-after: avoid;
    }
    
    h4 {
        font-size: 12pt;
        font-weight: bold;
        color: #374151;
        margin-top: 15pt;
        margin-bottom: 10pt;
        page-break-after: avoid;
    }
    
    p {
        margin-bottom: 10pt;
        text-indent: 0;
    }
    
    code {
        font-family: 'Courier New', monospace;
        font-size: 9pt;
        background-color: #f3f4f6;
        padding: 2pt 4pt;
        border-radius: 3pt;
        color: #dc2626;
    }
    
    pre {
        font-family: 'Courier New', monospace;
        font-size: 9pt;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-left: 4px solid #2563eb;
        padding: 12pt;
        margin: 15pt 0;
        overflow-x: auto;
        page-break-inside: avoid;
        line-height: 1.4;
    }
    
    pre code {
        background-color: transparent;
        padding: 0;
        color: #1f2937;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 15pt 0;
        font-size: 10pt;
        page-break-inside: avoid;
    }
    
    th {
        background-color: #2563eb;
        color: white;
        padding: 8pt;
        text-align: left;
        font-weight: bold;
        border: 1px solid #1e40af;
    }
    
    td {
        padding: 8pt;
        border: 1px solid #e5e7eb;
    }
    
    tr:nth-child(even) {
        background-color: #f9fafb;
    }
    
    ul, ol {
        margin: 10pt 0;
        padding-left: 25pt;
    }
    
    li {
        margin-bottom: 5pt;
    }
    
    blockquote {
        margin: 15pt 20pt;
        padding: 10pt 15pt;
        background-color: #eff6ff;
        border-left: 4px solid #2563eb;
        font-style: italic;
        page-break-inside: avoid;
    }
    
    hr {
        border: none;
        border-top: 2px solid #e5e7eb;
        margin: 25pt 0;
    }
    
    .page-break {
        page-break-after: always;
    }
    
    /* Table of Contents styling */
    #table-of-contents + ul {
        list-style-type: none;
        padding-left: 0;
    }
    
    #table-of-contents + ul li {
        margin-bottom: 8pt;
    }
    
    #table-of-contents + ul a {
        color: #2563eb;
        text-decoration: none;
    }
    
    /* Links */
    a {
        color: #2563eb;
        text-decoration: none;
    }
    
    a:hover {
        text-decoration: underline;
    }
    
    /* First page title */
    body > h1:first-child {
        font-size: 28pt;
        text-align: center;
        margin-top: 100pt;
        margin-bottom: 50pt;
        border-bottom: none;
    }
    
    /* Subtitle */
    body > h2:first-of-type {
        font-size: 16pt;
        text-align: center;
        color: #6b7280;
        margin-bottom: 80pt;
    }
    """
    
    # Create complete HTML document
    full_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>AI-Powered HRMS System Architecture</title>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Generate PDF
    print("Generating PDF with academic formatting...")
    HTML(string=full_html).write_pdf(
        pdf_file,
        stylesheets=[CSS(string=css_content)]
    )
    
    print(f"✅ PDF generated successfully: {pdf_file}")
    print(f"📄 File size: {os.path.getsize(pdf_file) / 1024:.2f} KB")
    
    return pdf_file

if __name__ == "__main__":
    try:
        pdf_path = generate_pdf()
        print(f"\n🎓 Academic PDF ready at:\n{pdf_path}")
    except Exception as e:
        print(f"❌ Error generating PDF: {e}")
        import traceback
        traceback.print_exc()
