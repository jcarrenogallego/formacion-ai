#!/usr/bin/env python3
"""Validate that a pull request only changes the author's student directory."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import PurePosixPath


def changed_paths(base: str, head: str) -> list[str]:
    result = subprocess.run(
        ["git", "diff", "--name-only", "--diff-filter=ACDMRT", "-z", base, head],
        check=True,
        capture_output=True,
    )
    return [path.decode("utf-8") for path in result.stdout.split(b"\0") if path]


def invalid_paths(author: str, owner: str, paths: list[str]) -> list[str]:
    if author.casefold() == owner.casefold():
        return []

    allowed_parts = ("estudiants", author.casefold())
    invalid: list[str] = []
    for raw_path in paths:
        parts = PurePosixPath(raw_path.replace("\\", "/")).parts
        normalized = tuple(part.casefold() for part in parts[:2])
        if len(parts) < 3 or normalized != allowed_parts:
            invalid.append(raw_path)
    return invalid


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--author", required=True)
    parser.add_argument("--owner", required=True)
    parser.add_argument("--base")
    parser.add_argument("--head")
    parser.add_argument("paths", nargs="*")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    paths = args.paths
    if not paths:
        if not args.base or not args.head:
            raise SystemExit("Provide paths or both --base and --head")
        paths = changed_paths(args.base, args.head)

    invalid = invalid_paths(args.author, args.owner, paths)
    if invalid:
        print(
            f"Error: @{args.author} solo puede modificar "
            f"estudiants/{args.author}/",
            file=sys.stderr,
        )
        for path in invalid:
            print(f"  - {path}", file=sys.stderr)
        return 1

    print(f"Validación correcta: {len(paths)} archivo(s) dentro del alcance permitido.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
