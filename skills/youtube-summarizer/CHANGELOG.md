# Changelog - youtube-summarizer

All notable changes to the youtube-summarizer skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-08-23 (fork: MariDjor)

### 🐛 Fixed

- **Broken transcript extraction against `youtube-transcript-api` >=1.0**
  - **Issue:** `extract-transcript.py` and the inline snippets in `SKILL.md` called `YouTubeTranscriptApi.get_transcript()` / `.list_transcripts()` as classmethods. Library versions >=1.0 removed those in favor of an instance-based API (`YouTubeTranscriptApi().fetch()` / `.list()`), so any environment with a current install hit `AttributeError: type object 'YouTubeTranscriptApi' has no attribute 'list_transcripts'` and failed immediately.
  - **Solution:** Detect which API shape is installed (`hasattr(YouTubeTranscriptApi, "get_transcript")`) and call the matching form. Applied in `extract-transcript.py` and documented in `SKILL.md` Step 0/2/3.

### ✨ Added

- **Timestamps preserved end-to-end.** Previous extraction collapsed the transcript into a single `" ".join(...)` string, discarding each segment's start time irrecoverably. `extract-transcript.py` now emits `[MM:SS|Ns] text` per line by default (`--plain` restores the old stripped-text behavior).
- **Two-part output structure.** Step 5 now produces (1) a chronological walkthrough of the video, in order, with a clickable `&t=Ns` timestamp on every section header and sub-topic, and (2) a thematic summary that regroups the same content by idea — with its own per-point timestamps — so themes the source revisits at widely separated points aren't silently merged into one undated blob.
- Step 4 added: explicit topic-boundary and recurring-theme identification pass over the timed transcript before writing prose, plus sponsor-break detection so ad reads don't read as a confusing content gap.

### 🔧 Changed

- Bumped major version to 2.0.0 given the output structure and extraction format both changed.

---

## [1.2.1] - 2026-02-04

### 🐛 Fixed

- **Exit code propagation in `--list` mode**
  - **Issue:** Script always exited with status 0 even when `list_available_transcripts()` failed
  - **Risk:** Broke automation pipelines that rely on exit codes to detect failures
  - **Root Cause:** Return value from `list_available_transcripts()` was ignored
  - **Solution:** Now properly checks return value and exits with code 1 on failure
  - **Impact:** Scripts in automation can now correctly detect when transcript listing fails (invalid video ID, network errors, etc.)

### 🔧 Changed

- `extract-transcript.py` (lines 58-60)
  - Before: `list_available_transcripts(video_id); sys.exit(0)`
  - After: `success = list_available_transcripts(video_id); sys.exit(0 if success else 1)`

### 📝 Notes

- **Breaking Change:** None - only affects error handling behavior
- **Backward Compatibility:** Scripts that check exit codes will now work correctly
- **Migration:** No changes needed for existing users

---

## [1.2.0] - 2026-02-04

### ✨ Added

- Intelligent prompt workflow integration
- LLM processing with Claude CLI or GitHub Copilot CLI
- Progress indicators with rich terminal UI
- Multiple output formats
- Enhanced error handling

### 🔧 Changed

- Major refactor of transcript extraction logic
- Improved documentation in SKILL.md
- Updated installation requirements

---

## [1.0.0] - 2025-02-01

### ✨ Initial Release

- YouTube transcript extraction
- Language detection and selection
- Basic summarization
- Markdown output format
- Support for multiple languages
