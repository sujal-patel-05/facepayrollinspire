import re
import base64
import requests
import pypandoc
import os

markdown_path = '/home/petpooja-1118/.gemini/antigravity/brain/52eccc37-7773-4954-b91a-2ba6c1fa1970/FaceAI_Thesis.md'
output_docx = '/home/petpooja-1118/Desktop/faceai/FaceAI_Academic_Thesis.docx'

print("Reading academic thesis...")
with open(markdown_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all mermaid blocks
mermaid_blocks = re.findall(r'```mermaid\n(.*?)```', content, re.DOTALL)
print(f"Found {len(mermaid_blocks)} Mermaid diagrams.")

for i, block in enumerate(mermaid_blocks):
    print(f"Rendering Mermaid chart {i+1} as image...")
    # Base64 encode the graph structure for mermaid.ink
    graphbytes = block.strip().encode("ascii")
    base64_bytes = base64.b64encode(graphbytes)
    base64_string = base64_bytes.decode("ascii")
    
    # HTTP endpoint for dynamic rendering
    image_url = f"https://mermaid.ink/img/{base64_string}"
    
    try:
        img_response = requests.get(image_url, timeout=15)
        img_filename = f"mermaid_diagram_{i}.png"
        if img_response.status_code == 200:
            with open(img_filename, 'wb') as img_file:
                img_file.write(img_response.content)
            # Swap out the code block for the standard image tag so Pandoc handles it natively
            content = content.replace(f'```mermaid\n{block}```', f'![Mermaid Diagram]({img_filename})')
            print(f"-> Integrated diagram {i+1} successfully.")
        else:
            print(f"-> Failed to fetch image {i+1}, HTTP Status: {img_response.status_code}")
    except Exception as e:
        print(f"-> Network error fetching image {i+1}: {e}")

# Save the altered markdown temporarily
temp_md = "temp_thesis.md"
with open(temp_md, 'w', encoding='utf-8') as f:
    f.write(content)

# Convert fully to a well formatted DOCX using the Pandoc binary
print(f"Compiling into native Microsoft Word DOCX format...")
pypandoc.convert_file(temp_md, 'docx', outputfile=output_docx)
print(f"Conversion complete! File located at: {output_docx}")

# Routine cleanup
os.remove(temp_md)
for i in range(len(mermaid_blocks)):
    if os.path.exists(f"mermaid_diagram_{i}.png"):
        os.remove(f"mermaid_diagram_{i}.png")
