#!/usr/bin/env python3
"""
Extract YouTube video transcript, with timestamps preserved.
Usage: ./extract-transcript.py VIDEO_ID [LANGUAGE_CODE]
       ./extract-transcript.py VIDEO_ID --list   (list available transcripts)
       ./extract-transcript.py VIDEO_ID --plain  (strip timestamps, old-style output)

Supports both the old (<=0.6) and new (>=1.0) youtube-transcript-api
class shapes: old exposes YouTubeTranscriptApi.get_transcript() /
.list_transcripts() as classmethods; new requires an instance and
.fetch() / .list(). Detecting and using whichever is installed avoids
silently breaking when the library is upgraded.
"""

import sys
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound


def _api():
    """Return a callable-ready API surface regardless of library version."""
    if hasattr(YouTubeTranscriptApi, "get_transcript"):
        # Old (<=0.6) classmethod-based API
        return "classic"
    return "instance"


def fmt_timestamp(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f"{h:02d}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def fetch_snippets(video_id, language="en"):
    """Return a list of (start_seconds, text) tuples, oldest first."""
    mode = _api()
    if mode == "classic":
        entries = YouTubeTranscriptApi.get_transcript(video_id, languages=[language, "en"])
        return [(e["start"], e["text"]) for e in entries]
    else:
        ytt_api = YouTubeTranscriptApi()
        fetched = ytt_api.fetch(video_id, languages=[language, "en"])
        return [(snippet.start, snippet.text) for snippet in fetched]


def extract_transcript(video_id, language="en", plain=False):
    try:
        snippets = fetch_snippets(video_id, language)
        if plain:
            return " ".join(text for _, text in snippets)
        return "\n".join(f"[{fmt_timestamp(start)}|{int(start)}s] {text}" for start, text in snippets)
    except TranscriptsDisabled:
        print(f"❌ Transcripts are disabled for video {video_id}", file=sys.stderr)
        sys.exit(1)
    except NoTranscriptFound:
        print(f"❌ No transcript found for video {video_id}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)


def list_available_transcripts(video_id):
    try:
        mode = _api()
        if mode == "classic":
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        else:
            transcript_list = YouTubeTranscriptApi().list(video_id)

        print(f"✅ Available transcripts for {video_id}:")
        for transcript in transcript_list:
            generated = "[Auto-generated]" if transcript.is_generated else "[Manual]"
            translatable = "(translatable)" if transcript.is_translatable else ""
            print(f"  - {transcript.language} ({transcript.language_code}) {generated} {translatable}")
        return True
    except Exception as e:
        print(f"❌ Error listing transcripts: {e}", file=sys.stderr)
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: ./extract-transcript.py VIDEO_ID [LANGUAGE_CODE] [--plain]")
        print("       ./extract-transcript.py VIDEO_ID --list  (list available transcripts)")
        sys.exit(1)

    video_id = sys.argv[1]
    rest = sys.argv[2:]

    if "--list" in rest:
        success = list_available_transcripts(video_id)
        sys.exit(0 if success else 1)

    plain = "--plain" in rest
    lang_args = [a for a in rest if not a.startswith("--")]
    language = lang_args[0] if lang_args else "en"

    print(extract_transcript(video_id, language, plain=plain))
