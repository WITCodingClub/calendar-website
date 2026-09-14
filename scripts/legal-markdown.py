#!/usr/bin/env python3
"""Write markdown copies of the /privacy and /tos pages.

The hook in src/hooks.server.ts serves these copies to agents that send
Accept: text/markdown. The pages are generated legal markup, so the copies come
from the rendered HTML, not from hand edits.

After you change the text of either page, run this script against a build of
the site:

    npm run build
    npx vite preview --port 4173
    python3 scripts/legal-markdown.py http://localhost:4173

Do not format the output. Prettier pads the tables with spaces, and agents pay
for each one, so .prettierignore skips src/lib/server/legal.

The script uses only the Python standard library.
"""

import re
import sys
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

PAGES = {
    "privacy": (
        "WIT-Calendar - Privacy Policy",
        "How WIT-Calendar collects, uses, stores, and shares personal information.",
    ),
    "tos": (
        "WIT-Calendar - Terms of Service",
        "The legal terms for using WIT-Calendar and its website.",
    ),
}

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "lib" / "server" / "legal"

SKIPPED = {"script", "style", "svg"}
PARAGRAPH = {"div", "p"}
HEADINGS = {"h1": 1, "h2": 2, "h3": 3, "h4": 4, "h5": 5, "h6": 6}
EMPHASIS = {"strong": "**", "b": "**", "em": "_", "i": "_"}

# Clean-up for text that the generator splits into many tags.
TIDY = [
    # Two bold runs with only a space between them are one run.
    (re.compile(r"\*\* \*\*"), " "),
    (re.compile(r"_\*\* \*\*_"), " "),
    # The page puts the space after a link in CSS (class mr-1), not in the text.
    (re.compile(r"(\]\([^)\s]*\))(?=\w)"), r"\1 "),
    # A space before punctuation comes from an empty generator tag.
    (re.compile(r" +([.,;])(?=\s|$)"), r"\1"),
]


class Opener:
    """An open emphasis or link in the text buffer, closed by its end tag.

    For emphasis inside emphasis of the same kind, value is None. Markdown has
    no nested emphasis, so the inner one adds no markers.
    """

    def __init__(self, kind, value):
        self.kind = kind
        self.value = value


class LegalMarkdown(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.capturing = False
        self.skip_depth = 0
        self.buffer = []
        self.blocks = []
        self.heading = None
        self.list_depth = 0
        self.in_item = False
        self.table_rows = None
        self.row = None
        self.row_is_header = False
        self.cell = None
        self.pending_table = None

    # Output

    def text_of(self, tokens):
        text = "".join(token for token in tokens if isinstance(token, str))
        text = re.sub(r"\s+", " ", text).strip()
        for pattern, replacement in TIDY:
            text = pattern.sub(replacement, text)
        return text

    def emit(self, kind, text):
        if kind != "table":
            self.flush_table()
        self.blocks.append((kind, text))

    def flush(self):
        text = self.text_of(self.buffer)
        self.buffer = []
        if not text:
            return
        if self.heading:
            # A heading is bold already, so emphasis inside it is noise.
            self.emit("heading", "#" * self.heading + " " + text.replace("**", ""))
        elif self.in_item:
            self.emit("item", "  " * (self.list_depth - 1) + "- " + text)
        else:
            self.emit("paragraph", text)

    def flush_table(self):
        rows = self.pending_table
        self.pending_table = None
        if not rows:
            return
        header = rows[0][1] if rows[0][0] else [""] * len(rows[0][1])
        body = [cells for is_header, cells in rows if not is_header]
        width = max(len(header), *(len(cells) for cells in body)) if body else len(header)

        def line(cells):
            cells = cells + [""] * (width - len(cells))
            return "| " + " | ".join(cells) + " |"

        lines = [line(header), "| " + " | ".join(["---"] * width) + " |"]
        lines += [line(cells) for cells in body]
        self.blocks.append(("table", "\n".join(lines)))

    def markdown(self):
        self.flush()
        self.flush_table()
        out = []
        previous = None
        for kind, text in self.blocks:
            if out:
                out.append("\n" if kind == "item" and previous == "item" else "\n\n")
            out.append(text)
            previous = kind
        return "".join(out) + "\n"

    # Parser events

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)

        if not self.capturing:
            if tag == "div" and attrs.get("data-custom-class") == "body":
                self.capturing = True
            return

        if tag == "footer":
            self.flush()
            self.capturing = False
            return

        if tag in SKIPPED:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return

        if self.cell is not None:
            self.start_inline(tag, attrs, in_cell=True)
            return

        if tag in PARAGRAPH:
            self.flush()
        elif tag == "br":
            self.flush()
        elif tag in HEADINGS:
            self.flush()
            self.heading = HEADINGS[tag]
        elif tag in ("ul", "ol"):
            self.flush()
            self.list_depth += 1
        elif tag == "li":
            self.flush()
            self.in_item = True
        elif tag == "table":
            self.flush()
            self.table_rows = []
        elif tag == "tr" and self.table_rows is not None:
            self.row = []
            self.row_is_header = False
        elif tag in ("td", "th") and self.row is not None:
            self.cell = []
            if tag == "th":
                self.row_is_header = True
        else:
            self.start_inline(tag, attrs, in_cell=False)

    def start_inline(self, tag, attrs, in_cell):
        target = self.cell if in_cell else self.buffer
        if tag == "br":
            target.append(" ")
        elif tag in EMPHASIS:
            marker = EMPHASIS[tag]
            already_open = any(
                isinstance(token, Opener) and token.kind == "emphasis" and token.value == marker
                for token in target
            )
            target.append(Opener("emphasis", None if already_open else marker))
        elif tag == "a":
            target.append(Opener("link", attrs.get("href") or ""))

    def handle_endtag(self, tag):
        if not self.capturing:
            return
        if tag in SKIPPED:
            self.skip_depth = max(0, self.skip_depth - 1)
            return
        if self.skip_depth:
            return

        if self.cell is not None and tag not in ("td", "th"):
            self.end_inline(tag, self.cell)
            return

        if tag in PARAGRAPH:
            self.flush()
        elif tag in HEADINGS:
            self.flush()
            self.heading = None
        elif tag in ("ul", "ol"):
            self.flush()
            self.list_depth = max(0, self.list_depth - 1)
        elif tag == "li":
            self.flush()
            self.in_item = False
        elif tag in ("td", "th") and self.row is not None:
            cell = self.text_of(self.cell).replace("|", "\\|")
            self.row.append(cell)
            self.cell = None
        elif tag == "tr" and self.row is not None:
            if any(self.row):
                self.table_rows.append((self.row_is_header, self.row))
            self.row = None
        elif tag == "table" and self.table_rows is not None:
            # The generator splits one long table into parts. A part that
            # follows a table with no text between them continues that table.
            if self.pending_table is None:
                self.pending_table = self.table_rows
            else:
                self.pending_table.extend(self.table_rows)
            self.table_rows = None
        else:
            self.end_inline(tag, self.buffer)

    def end_inline(self, tag, target):
        if tag in EMPHASIS:
            kind = "emphasis"
        elif tag == "a":
            kind = "link"
        else:
            return

        index = next(
            (
                i
                for i in range(len(target) - 1, -1, -1)
                if isinstance(target[i], Opener) and target[i].kind == kind
            ),
            None,
        )
        # The opener was flushed with an earlier block, so there is nothing to close.
        if index is None:
            return

        opener = target[index]
        raw = "".join(token for token in target[index + 1 :] if isinstance(token, str))
        inner = re.sub(r"\s+", " ", raw)
        stripped = inner.strip()
        lead = " " if inner[:1] == " " else ""
        trail = " " if inner[-1:] == " " else ""

        if not stripped:
            replacement = inner
        elif kind == "emphasis":
            if opener.value is None:
                replacement = inner
            else:
                replacement = f"{lead}{opener.value}{stripped}{opener.value}{trail}"
        else:
            href = opener.value
            # Fragment links point at anchors in the HTML page, which markdown
            # does not have, so only the text stays.
            if not href or href.startswith("#"):
                replacement = inner
            else:
                replacement = f"{lead}[{stripped}]({href}){trail}"

        # Keep any opener that is still open inside this range, so that its
        # end tag can find it.
        still_open = [
            token for token in target[index + 1 :] if isinstance(token, Opener)
        ]
        del target[index:]
        target.extend(still_open)
        target.append(replacement)

    def handle_data(self, data):
        if not self.capturing or self.skip_depth:
            return
        text = data.replace("\\", "\\\\").replace("*", "\\*")
        if self.cell is not None:
            self.cell.append(text)
        else:
            self.buffer.append(text)


def convert(html, title, description):
    parser = LegalMarkdown()
    parser.feed(html)
    parser.close()
    front_matter = f"---\ntitle: {title}\ndescription: {description}\n---\n\n"
    return front_matter + parser.markdown()


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: python3 scripts/legal-markdown.py <site origin, for example http://localhost:4173>")

    origin = sys.argv[1].rstrip("/")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for name, (title, description) in PAGES.items():
        request = urllib.request.Request(f"{origin}/{name}", headers={"Accept": "text/html"})
        with urllib.request.urlopen(request) as response:
            html = response.read().decode("utf-8")

        markdown = convert(html, title, description)
        path = OUTPUT_DIR / f"{name}.md"
        path.write_text(markdown, encoding="utf-8")
        print(f"wrote {path} ({len(markdown)} characters)")


if __name__ == "__main__":
    main()
