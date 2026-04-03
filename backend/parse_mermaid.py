import re
import base64
import requests

markdown_path = '/home/petpooja-1118/.gemini/antigravity/brain/52eccc37-7773-4954-b91a-2ba6c1fa1970/FaceAI_Thesis.md'

with open(markdown_path, 'r', encoding='utf-8') as f:
    content = f.read()

mermaid_blocks = re.findall(r'```mermaid\n(.*?)```', content, re.DOTALL)
print(f"Found {len(mermaid_blocks)} Mermaid diagrams.")

for i, block in enumerate(mermaid_blocks):
    graphbytes = block.strip().encode("ascii")
    base64_bytes = base64.b64encode(graphbytes)
    base64_string = base64_bytes.decode("ascii")
    
    image_url = f"https://mermaid.ink/img/{base64_string}"
    print(f"Fetching diagram {i+1}...")
    try:
        img_response = requests.get(image_url, headers={"Accept": "image/png"}, timeout=15)
        img_filename = f"mermaid_diagram_{i}.png"
        if img_response.status_code == 200:
            with open(img_filename, 'wb') as img_file:
                img_file.write(img_response.content)
            content = content.replace(f'```mermaid\n{block}```', f'![Diagram]({img_filename})')
            print(f"-> Integrated diagram {i+1} successfully.")
        else:
            print(f"-> Failed to fetch image {i+1}, HTTP Status: {img_response.status_code}")
    except Exception as e:
        print(f"-> Error fetching image {i+1}: {e}")

temp_md = "temp_thesis.md"
with open(temp_md, 'w', encoding='utf-8') as f:
    f.write(content)
print("Intermediate markdown generated.")
