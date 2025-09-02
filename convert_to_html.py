import markdown

with open("PROJETO_STATUS.md", "r", encoding="utf-8") as f:
    md_content = f.read()

html_content = markdown.markdown(md_content, extensions=["tables"])

with open("PROJETO_STATUS.html", "w", encoding="utf-8") as f:
    f.write(html_content)


