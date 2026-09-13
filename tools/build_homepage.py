"""Generate the public homepage and local assets from the approved preview.

Run: python tools/build_homepage.py (standard library only).
Publication records remain a static selection; this is not a scholarly importer.
"""
from pathlib import Path
from urllib.parse import urlsplit
import re
import shutil
import hashlib

ROOT = Path(__file__).resolve().parent.parent
PREVIEW = ROOT / "site-rebuild-brief" / "preview"
ASSETS = ROOT / "assets" / "site"


def build():
    ASSETS.mkdir(parents=True, exist_ok=True)
    for name in ("ambient.css", "ambient.js", "publications.css", "publications.js", "profiles.css", "portrait-window-original.png"):
        shutil.copy2(PREVIEW / name, ASSETS / name)
    shutil.copytree(PREVIEW / "icons", ASSETS / "icons", dirs_exist_ok=True)
    shutil.copy2(ROOT / "site-rebuild-brief" / "portrait.png", ASSETS / "portrait-pixel.png")
    html = (PREVIEW / "index.html").read_text(encoding="utf-8")

    def local_path(match):
        attribute, value = match.groups()
        if value.startswith(("#", "/")) or urlsplit(value).scheme:
            return match.group(0)
        if value == "../portrait.png":
            target = "/assets/site/portrait-pixel.png"
        elif value.startswith("../../"):
            target = "/" + value[6:]
        else:
            target = "/assets/site/" + value
        return f'{attribute}="{target}"'

    html = re.sub(r'\b(href|src|data-portrait)="([^\"]+)"', local_path, html)
    # Content versions prevent stale JS/CSS after a Pages deployment.
    for asset in ASSETS.iterdir():
        if asset.suffix in (".js", ".css"):
            version = hashlib.sha256(asset.read_bytes()).hexdigest()[:10]
            html = html.replace(f'"/assets/site/{asset.name}"', f'"/assets/site/{asset.name}?v={version}"')
    html, count = re.subn(r'<meta(?=[^>]*name="robots")[^>]*>', '', html)
    assert count == 1, "Expected the preview robots tag"
    html, count = re.subn(r'<div class="preview-note">.*?</div>', '', html)
    assert count == 1, "Expected the preview banner"
    html = html.replace('Local design prototype · September 2026 · publication data is a static selection', 'Selected publications · Full bibliography in the archive')
    html = html.replace('href="https://orcid.org/0000-0003-1674-8876">Browse ORCID', 'href="/legacy.html#publications">Full bibliography')
    html = html.replace('<section aria-labelledby="activity-title"', '<span id="news"></span><section aria-labelledby="activity-title"')
    html = html.replace('</head>', '<link rel="canonical" href="https://dgiunchi.github.io/"/><meta name="description" content="Daniele Giunchi, Assistant Professor at the University of Birmingham. Research in intelligent XR interfaces, human-computer interaction, and collaborative virtual environments."/></head>')
    (ROOT / "index.html").write_text(html, encoding="utf-8")
    print("Built index.html and assets/site from the preview.")


if __name__ == "__main__":
    build()
