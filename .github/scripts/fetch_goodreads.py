#!/usr/bin/env python3
"""Fetch Goodreads RSS and write _data/goodreads.json for Jekyll."""

import json
import sys
import urllib.request
from datetime import datetime
from xml.etree import ElementTree as ET

USER_ID = "186927305"
YEAR = datetime.now().year


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "mikeveltman-site/1.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()


def parse_books(xml_bytes):
    xml_str = xml_bytes.decode("utf-8")
    root = ET.fromstring(xml_str)
    channel = root.find("channel") or root
    books = []

    for item in channel.findall("item"):
        def g(tag):
            el = item.find(tag)
            return (el.text or "").strip() if el is not None else ""

        raw_title = g("title")
        author = g("author_name")

        if not author and " by " in raw_title:
            raw_title, author = raw_title.rsplit(" by ", 1)

        cover = (
            g("book_large_image_url")
            or g("book_medium_image_url")
            or g("book_image_url")
            or g("book_small_image_url")
        )

        books.append({
            "title": raw_title,
            "author": author,
            "cover": cover,
            "url": g("link") or g("guid"),
            "read_at": g("user_read_at"),
        })

    return books


def main():
    # Currently reading shelf
    try:
        xml = fetch(
            f"https://www.goodreads.com/review/list_rss/{USER_ID}"
            "?shelf=currently-reading"
        )
        currently = parse_books(xml)
        print(f"Currently reading: {len(currently)}", file=sys.stderr)
    except Exception as exc:
        print(f"Error fetching currently-reading: {exc}", file=sys.stderr)
        currently = []

    # Read shelf — grab last 200 entries and filter to current year
    try:
        xml = fetch(
            f"https://www.goodreads.com/review/list_rss/{USER_ID}"
            "?shelf=read&sort=date_read&order=d&per_page=200"
        )
        all_read = parse_books(xml)
        read_this_year = [b for b in all_read if str(YEAR) in b.get("read_at", "")]
        print(f"Read in {YEAR}: {len(read_this_year)}", file=sys.stderr)
    except Exception as exc:
        print(f"Error fetching read shelf: {exc}", file=sys.stderr)
        read_this_year = []

    data = {
        "year": YEAR,
        "read_count": len(read_this_year),
        "currently_reading": currently,
        "recent_reads": read_this_year[:6],
    }

    out_path = "_data/goodreads.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Wrote {out_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
