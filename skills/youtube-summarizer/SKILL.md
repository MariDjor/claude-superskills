---
name: youtube-summarizer
description: This skill should be used when the user needs to extract transcripts from YouTube videos and generate comprehensive, timestamp-linked summaries organized both chronologically and thematically.
license: MIT
---

# youtube-summarizer

## Purpose

This skill extracts transcripts from YouTube videos — with timestamps preserved — and generates comprehensive summaries structured in two complementary ways: a **chronological walkthrough** (so the reader can browse the conversation in order and jump straight into the video at any point) and a **thematic summary** (so the reader can see everything the video says about one idea, even when the source material revisits that idea multiple times far apart). Every section header and every key point in both parts carries a clickable timestamp link (`https://www.youtube.com/watch?v=VIDEO_ID&t=Ns`) into the actual video.

It validates video availability, extracts transcripts using the `youtube-transcript-api` Python library, and produces detailed documentation capturing all insights, arguments, and key points — without discarding *when* in the video each one happens.

The skill is designed for users who need thorough, navigable reference documentation from educational videos, lectures, interviews, podcasts, or informational content, and who want to jump back into the source video rather than just read a summary.

## When to Use This Skill

This skill should be used when:

- User provides a YouTube video URL and wants a detailed summary
- User needs to document video content for reference without rewatching
- User wants to extract insights, key points, and arguments from educational content, with the ability to jump back into the video at any point
- User needs transcripts from YouTube videos for analysis
- User asks to "summarize", "resume", or "extract content" from YouTube videos
- User wants comprehensive documentation prioritizing completeness over brevity
- User wants both a browsable, in-order walkthrough **and** a topic-grouped reference of the same video

## Step 0: Environment Detection & Setup

Before processing, detect the execution environment to choose the correct transcript extraction strategy.

### Environment Detection

```bash
# Test 1: Can we run local Python?
python3 --version 2>/dev/null
PYTHON_AVAILABLE=$?

# Test 2: Is youtube-transcript-api installed?
python3 -c "import youtube_transcript_api" 2>/dev/null
LIB_AVAILABLE=$?
```

Three modes are supported, tried in order:

| Mode | Condition | Strategy |
|------|-----------|----------|
| **A — Python/CLI** | Python 3 available + library installed | `youtube-transcript-api` (full featured, timestamps preserved) |
| **B — WebFetch** | No Python OR sandboxed environment | Fetch YouTube page → extract transcript from embedded JSON (timestamps available via the caption XML's `start` attribute) |
| **C — Manual** | YouTube blocked at network level | Ask user to paste transcript text directly (no timestamps available; fall back to a themes-only summary, see Step 5) |

### Mode A Setup (Python available, library missing)

If Python is available but `youtube-transcript-api` is not installed, offer to install:

```
youtube-transcript-api is required but not installed.

Would you like to install it now?
- [ ] Yes - Install with pip (pip install youtube-transcript-api)
- [ ] No - I'll install it manually
```

```bash
pip install youtube-transcript-api
```

**Important — library version compatibility:** `youtube-transcript-api` changed its API shape between v0.x and v1.x. Versions ≤0.6 expose `YouTubeTranscriptApi.get_transcript(video_id, ...)` and `.list_transcripts(video_id)` as **classmethods**. Versions ≥1.0 require an **instance** — `YouTubeTranscriptApi().fetch(video_id, ...)` and `YouTubeTranscriptApi().list(video_id)` — and `.fetch()` returns `FetchedTranscriptSnippet` objects (`.text`, `.start`, `.duration`), not dicts. Detect which shape is installed before calling it — do not assume the old classmethod form still works:

```python
from youtube_transcript_api import YouTubeTranscriptApi

if hasattr(YouTubeTranscriptApi, "get_transcript"):
    API_MODE = "classic"   # <=0.6
else:
    API_MODE = "instance"  # >=1.0
```

`scripts/extract-transcript.py` in this skill already handles both shapes automatically — prefer calling it over hand-writing the snippet above.

### Mode B Setup (Sandboxed / Claude Cowork / no Python)

Use WebFetch to extract the transcript embedded in the YouTube page HTML. YouTube embeds full caption track URLs in `ytInitialPlayerResponse` JSON inside the page source.

Steps:
1. WebFetch `https://www.youtube.com/watch?v=VIDEO_ID`
2. Extract `ytInitialPlayerResponse` JSON block from the HTML using regex
3. Parse `captions.playerCaptionsTracklistRenderer.captionTracks[0].baseUrl`
4. WebFetch that URL to retrieve the transcript XML — each `<text start="123.4" dur="2.1">...</text>` element's `start` attribute is the timestamp in seconds; keep it
5. Parse XML `<text>` elements into `(start_seconds, text)` pairs, not plain text

If the YouTube page itself is blocked (proxy/sandbox restriction), fall through to Mode C.

### Mode C Setup (Network blocked)

Inform the user clearly:

```
⚠️  YouTube is not accessible in this environment.

Options:
1. Run this skill in Claude Code (CLI) — it has full network access and can install Python libraries.
2. Paste the video transcript text directly into this chat — the skill will summarize whatever text you provide, but without timestamp links (pasted transcripts don't carry timing data).
3. Copy the transcript from youtube.com/watch?v=VIDEO_ID → click "..." → "Show transcript" → paste here.
```

## Main Workflow

### Progress Tracking Guidelines

Throughout the workflow, display a visual progress gauge before each step to keep the user informed. The gauge format is:

```bash
echo "[████░░░░░░░░░░░░░░░░] 20% - Step 1/5: Validating URL"
```

**Format specifications:**
- 20 characters wide (use █ for filled, ░ for empty)
- Percentage increments: Step 1=20%, Step 2=40%, Step 3=60%, Step 4=80%, Step 5=100%
- Step counter showing current/total (e.g., "Step 3/5")
- Brief description of current phase

**Display the initial status box before Step 1:**

```
╔══════════════════════════════════════════════════════════════╗
║     📹  YOUTUBE SUMMARIZER - Processing Video                ║
╠══════════════════════════════════════════════════════════════╣
║ → Step 1: Validating URL                 [IN PROGRESS]       ║
║ ○ Step 2: Checking Availability                              ║
║ ○ Step 3: Extracting Transcript                              ║
║ ○ Step 4: Generating Summary                                 ║
║ ○ Step 5: Formatting Output                                  ║
╠══════════════════════════════════════════════════════════════╣
║ Progress: ██████░░░░░░░░░░░░░░░░░░░░░░░░  20%               ║
╚══════════════════════════════════════════════════════════════╝
```

### Step 1: Validate YouTube URL

**Objective:** Extract video ID and validate URL format.

**Supported URL Formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

A URL may also carry a `&t=Ns` / `?t=Ns` fragment (a timestamp the user was watching from) — extract and note it, but it doesn't change extraction; it's just a hint about what part of the video the user cares about.

**Actions:**

```bash
# Extract video ID using regex or URL parsing
URL="$USER_PROVIDED_URL"

# Pattern 1: youtube.com/watch?v=VIDEO_ID
if echo "$URL" | grep -qE 'youtube\.com/watch\?v='; then
    VIDEO_ID=$(echo "$URL" | sed -E 's/.*[?&]v=([^&]+).*/\1/')
# Pattern 2: youtu.be/VIDEO_ID  
elif echo "$URL" | grep -qE 'youtu\.be/'; then
    VIDEO_ID=$(echo "$URL" | sed -E 's/.*youtu\.be\/([^?]+).*/\1/')
else
    echo "❌ Invalid YouTube URL format"
    exit 1
fi

echo "📹 Video ID extracted: $VIDEO_ID"
```

**If URL is invalid:**

```
❌ Invalid YouTube URL

Please provide a valid YouTube URL in one of these formats:
- https://www.youtube.com/watch?v=VIDEO_ID
- https://youtu.be/VIDEO_ID

Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Step 2: Check Video & Transcript Availability

**Progress:**
```bash
echo "[████████░░░░░░░░░░░░] 40% - Step 2/5: Checking Availability"
```

**Objective:** Verify video exists and transcript is accessible using the detected mode.

**Mode A (Python):**

```bash
python3 scripts/extract-transcript.py "$VIDEO_ID" --list
```

or, if writing it inline instead of calling the script, detect the installed API shape first (see Step 0) and call the matching form:

```python
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import sys

video_id = sys.argv[1]

try:
    if hasattr(YouTubeTranscriptApi, "get_transcript"):
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)   # <=0.6
    else:
        transcript_list = YouTubeTranscriptApi().list(video_id)            # >=1.0

    print(f"✅ Video accessible: {video_id}")
    for transcript in transcript_list:
        lang_type = "[Auto-generated]" if transcript.is_generated else "[Manual]"
        print(f"  - {transcript.language} ({transcript.language_code}) {lang_type}")

except TranscriptsDisabled:
    print(f"❌ Transcripts are disabled for video {video_id}")
    sys.exit(1)
except NoTranscriptFound:
    print(f"❌ No transcript found for video {video_id}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error accessing video: {e}")
    sys.exit(1)
```

**Mode B (WebFetch):**

Use WebFetch to load `https://www.youtube.com/watch?v=VIDEO_ID`. Search the HTML for the string `"captionTracks"` to confirm captions are available. If the page is inaccessible or no `captionTracks` key is found, fall through to Mode C.

**Error Handling:**

| Error | Message | Action |
|-------|---------|--------|
| Video not found | "❌ Video does not exist or is private" | Ask user to verify URL |
| Transcripts disabled | "❌ Transcripts are disabled for this video" | Cannot proceed |
| No transcript available | "❌ No transcript found" | Cannot proceed |
| YouTube blocked (sandbox) | "⚠️ YouTube is not accessible in this environment" | Switch to Mode C |

### Step 3: Extract Transcript (with timestamps)

**Progress:**
```bash
echo "[████████████░░░░░░░░] 60% - Step 3/5: Extracting Transcript"
```

**Objective:** Retrieve the transcript **with per-segment start times preserved** — do not collapse it into plain text. The whole point of the chronological/thematic structure in Step 5 is being able to cite a real timestamp for each point; a transcript that's just `" ".join(text)` throws that data away irrecoverably.

**Mode A (Python) — preferred, via the bundled script:**

```bash
python3 scripts/extract-transcript.py "$VIDEO_ID" en > "/tmp/transcript_${VIDEO_ID}_timed.txt"
```

This writes one line per caption segment in the form:

```
[MM:SS|Ns] transcript text for that segment
[MM:SS|Ns] next segment...
```

(`Ns` is the raw integer seconds, ready to drop into `&t=Ns` links; `MM:SS` — or `HH:MM:SS` past the one-hour mark — is for human display.) Read this file into context for Step 4/5.

**Mode A (Python) — inline, if not using the script:**

```python
from youtube_transcript_api import YouTubeTranscriptApi

video_id = "VIDEO_ID"

def fmt(s):
    h, m, sec = int(s // 3600), int((s % 3600) // 60), int(s % 60)
    return f"{h:02d}:{m:02d}:{sec:02d}" if h else f"{m:02d}:{sec:02d}"

try:
    if hasattr(YouTubeTranscriptApi, "get_transcript"):
        entries = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])  # <=0.6
        snippets = [(e["start"], e["text"]) for e in entries]
    else:
        fetched = YouTubeTranscriptApi().fetch(video_id, languages=['en'])          # >=1.0
        snippets = [(s.start, s.text) for s in fetched]

    print(f"✅ Transcript extracted successfully — {len(snippets)} segments")
    with open(f"/tmp/transcript_{video_id}_timed.txt", "w") as f:
        for start, text in snippets:
            f.write(f"[{fmt(start)}|{int(start)}s] {text}\n")
except Exception as e:
    print(f"❌ Error extracting transcript: {e}")
    exit(1)
```

**Mode B (WebFetch):**

1. WebFetch the YouTube video page: `https://www.youtube.com/watch?v=VIDEO_ID`
2. Locate the `ytInitialPlayerResponse` JSON block in the HTML
3. Extract `captions.playerCaptionsTracklistRenderer.captionTracks[0].baseUrl`
4. WebFetch that caption URL (returns XML with `<text start="..." dur="...">` elements)
5. Parse into `(start_seconds, text)` pairs — keep the `start` attribute, don't discard it

If the page load fails or no caption track URL is found, switch to Mode C.

**Mode C (Manual):**

Ask the user to provide the transcript:

```
⚠️  YouTube is not accessible in this environment (proxy/sandbox restriction).

To proceed, paste the video transcript text directly into this chat.
To get it: go to youtube.com/watch?v=VIDEO_ID → click "..." below the video → "Show transcript" → copy all text.

Note: a pasted transcript won't carry timestamps, so the summary in Step 5 will
use the themes-only fallback (no timestamp links, no chronological part).

Alternatively, run this skill in Claude Code (CLI) for automatic extraction with timestamps.
```

Accept any plain text the user pastes and proceed directly to Step 4.

**Transcript Processing (all modes):**

- Keep each segment's start time attached to its text — this is the input the whole Step 5 structure depends on
- Preserve punctuation and formatting where available
- Remove `[Music]`, `[Applause]` and other auto-generated noise markers
- If the transcript is very long, it's fine to read it in chunks (offset/limit) — just don't lose track of which timestamp range each chunk covers

### Step 4: Identify the Topic Structure

**Progress:**
```bash
echo "[████████████████░░░░] 80% - Step 4/5: Generating Summary"
```

**Objective:** Before writing prose, map out two views of the same content:

1. **Chronological topic boundaries** — walk the timed transcript in order and mark where the conversation/lecture shifts from one topic to the next. Note the starting timestamp of each shift. If the source has ads/sponsor breaks (common in podcasts), identify their start/end timestamps too, so they can be marked as a skippable aside rather than silently causing a confusing gap.
2. **Recurring themes** — while reading, note when a topic that was already covered gets revisited later, sometimes from a different angle (common in freeform interviews and conversations). Record every timestamp where that theme resurfaces, not just the first.

For a video with no reliable timestamps (Mode C fallback), skip building the chronological part — go straight to a themes-only version of Step 5's output, without invented timestamps.

### Step 5: Format and Present Output

**Progress:**
```bash
echo "[████████████████████] 100% - Step 5/5: Formatting Output"
```

**Objective:** Deliver a summary with two complementary parts, both timestamp-linked. Every timestamp anywhere in the document is a Markdown link in the form `[MM:SS](https://www.youtube.com/watch?v=VIDEO_ID&t=Ns)`, using the raw seconds captured in Step 3 — never estimate or invent a timestamp.

**Output Structure:**

```markdown
# [Video Title]

**Channel:** [Channel Name]
**Guest(s):** [if applicable]
**URL:** https://www.youtube.com/watch?v=VIDEO_ID
**Runtime:** [HH:MM:SS]

> Timestamps below are clickable links that jump straight into the video.

## 📊 Executive Summary

[3-6 sentences: what this video is, who's in it, and its through-line/thesis.]

---

## PART 1 — Chronological Walkthrough

Follow the content in the order it actually happens, so you can browse and jump
into the video wherever a topic catches your eye.

### [[MM:SS](...&t=Ns)] [Topic label for this stretch]

*Topics: [[sub-point](...&t=N1s)] · [[sub-point](...&t=N2s)] · [[sub-point](...&t=N3s)]*

[1-3 sentences of what's covered in this stretch, citing specific claims/quotes.]

> *[[MM:SS](...&t=Ns)]–[[MM:SS](...&t=Ns)] — sponsor break ([brand])*   ← only if applicable

### [[MM:SS](...&t=Ns)] [Next topic label]
...continue through the full runtime...

---

## PART 2 — Thematic Summary

The same content regrouped by idea, so every mention of a theme is in one
place — including when the source circles back to it later.

### [Theme name]

- [Point, with its own timestamp] — [[MM:SS](...&t=Ns)]
- [Point that recurs later — cite BOTH occurrences] — [[MM:SS](...&t=N1s)] and again at [[MM:SS](...&t=N2s)]

### [Next theme]
...

---

## 📚 Concepts and Terminology

- **[Term]:** [Definition/context] — first used at [[MM:SS](...&t=Ns)]

## 📌 Conclusion

[Final synthesis and takeaways — no new timestamps needed here.]
```

**Guidance on splitting Part 1 into blocks:** a new chronological block starts wherever the topic actually shifts in the source — not on a fixed time interval. A block can be 30 seconds or 15 minutes; let the content decide. Each block's header timestamp is a real jump-in point (a `&t=Ns` link), and the italic "Topics:" line under each header links the specific quotes/sub-points mentioned within that stretch, so the reader can see at a glance what's in a block before clicking in.

**Guidance on Part 2 themes:** pick 5-8 wide themes that actually recur or that organize the material better than strict chronology (e.g. "Talent-spotting," "Integrity & trust," "Key relationships"). A theme is only worth having if it either (a) pulls together mentions from more than one point in the chronological timeline, or (b) meaningfully regroups material that was chronologically scattered across unrelated topics in Part 1. If a topic was only ever discussed once, in one contiguous block, it doesn't need its own Part 2 theme — Part 1 already covers it.

**Save Options:**

```
What would you like to save?
→ Summary + raw timed transcript

✅ File saved: summary-VIDEO_ID-YYYY-MM-DD.md
[████████████████████] 100% - ✓ Processing complete!
```

## Error Handling

| Error | Likely Cause | Action |
|-------|-------------|--------|
| Invalid YouTube URL format | URL is not a recognized youtube.com or youtu.be pattern | Show valid URL formats, ask user to provide correct URL |
| Video not found or private | Video was removed, made private, or URL is wrong | Inform user, ask for a public video URL |
| Transcripts disabled | Creator disabled transcripts on this video | Inform user transcripts are unavailable; suggest manual transcription |
| No transcript found | Video has no auto-generated or manual transcript | Inform user; suggest trying a different video or using audio-transcriber |
| `youtube-transcript-api` not installed | Python dependency missing | Offer to install with `pip install youtube-transcript-api` |
| `AttributeError: type object 'YouTubeTranscriptApi' has no attribute 'list_transcripts'` (or similar) | Installed library is v1.x+ and only exposes the instance-based API (`.fetch()`/`.list()`); code is calling the old v0.x classmethod form | Detect the installed shape first (see Step 0) and call the matching form — or just invoke `scripts/extract-transcript.py`, which already handles both |
| YouTube blocked — proxy/sandbox error | Running in Claude Cowork or other sandboxed environment | Switch to Mode B (WebFetch); if also blocked, switch to Mode C (manual paste) |
| Network error / timeout | Internet connectivity issue or YouTube rate-limiting | Retry once; if it persists, inform user and ask to try again later |
| Transcript in unexpected language | Video is in a language not supported by the analyzer | Report detected language; proceed with available transcript |
| Transcript pasted manually (Mode C) | No timing data available | Produce the themes-only fallback (Part 2 style, no Part 1, no timestamp links) instead of inventing timestamps |

**Version:** 2.0.0
**Last Updated:** 2026-08-23
**Maintained By:** Eric Andrade (original); fork maintained by MariDjor
