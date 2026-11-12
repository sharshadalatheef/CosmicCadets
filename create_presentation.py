import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck(filename="CosmicCadets_Presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    BG_DARK = RGBColor(7, 11, 40)        # #070b28 Deep Space
    CARD_BG = RGBColor(17, 24, 66)       # #111842 Elevated Deck
    CARD_BORDER = RGBColor(34, 48, 105)  # #223069
    CYAN = RGBColor(76, 201, 240)        # #4cc9f0 Accent Blue
    GOLD = RGBColor(255, 210, 63)        # #ffd23f Star Gold
    ORANGE = RGBColor(255, 122, 61)      # #ff7a3d Thruster Orange
    WHITE = RGBColor(255, 255, 255)
    MUTED = RGBColor(160, 175, 215)
    GREEN = RGBColor(78, 205, 196)

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=""):
        # Tag pill
        tag_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(3.2), Inches(0.42))
        tag_box.fill.solid()
        tag_box.fill.fore_color.rgb = CARD_BG
        tag_box.line.color.rgb = CYAN
        tag_box.line.width = Pt(1)
        tf_tag = tag_box.text_frame
        tf_tag.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = CYAN
        p_tag.font.name = "Arial"
        p_tag.alignment = PP_ALIGN.CENTER

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.7), Inches(0.9))
        tf = t_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(30)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.font.name = "Arial"

        if subtitle_text:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(14)
            p_sub.font.color.rgb = MUTED
            p_sub.font.name = "Arial"

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)

    # Accent decorative glow rectangle
    glow = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.0), Inches(11.733), Inches(5.5))
    glow.fill.solid()
    glow.fill.fore_color.rgb = CARD_BG
    glow.line.color.rgb = CARD_BORDER
    glow.line.width = Pt(1.5)

    # Title content
    t1_box = s1.shapes.add_textbox(Inches(1.4), Inches(1.6), Inches(10.5), Inches(4.2))
    tf1 = t1_box.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "COMPETITION PRESENTATION"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = CYAN
    p.font.name = "Arial"

    p2 = tf1.add_paragraph()
    p2.text = "CosmicCadets"
    p2.font.size = Pt(50)
    p2.font.bold = True
    p2.font.color.rgb = GOLD
    p2.font.name = "Arial"

    p3 = tf1.add_paragraph()
    p3.text = "Zero-Bloat, High-Tactile Space Training Arcade for Young Explorers (Ages 7-12)"
    p3.font.size = Pt(20)
    p3.font.bold = True
    p3.font.color.rgb = WHITE
    p3.font.name = "Arial"
    p3.space_before = Pt(12)

    p4 = tf1.add_paragraph()
    p4.text = "Built with Pure Vanilla JS, Web Audio Synthesizer & Canvas Engine. Zero Frameworks. Zero Emojis. 100% Kid-Safe."
    p4.font.size = Pt(14)
    p4.font.color.rgb = MUTED
    p4.font.name = "Arial"
    p4.space_before = Pt(8)

    # 3 Pill Badges at bottom of Title Slide
    pill_data = [
        ("TRACK", "Interactive EdTech / Web Dev"),
        ("TECH STACK", "Vanilla JS, Canvas, Web Audio"),
        ("DELIVERY", "Offline PWA + Vercel Serverless")
    ]
    for i, (k, v) in enumerate(pill_data):
        bx = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.4 + i * 3.6), Inches(4.8), Inches(3.4), Inches(1.1))
        bx.fill.solid()
        bx.fill.fore_color.rgb = RGBColor(12, 18, 48)
        bx.line.color.rgb = CYAN if i == 0 else (GOLD if i == 1 else GREEN)
        bx.line.width = Pt(1.2)
        btf = bx.text_frame
        btf.vertical_anchor = MSO_ANCHOR.MIDDLE
        bp1 = btf.paragraphs[0]
        bp1.text = k
        bp1.font.size = Pt(10)
        bp1.font.bold = True
        bp1.font.color.rgb = MUTED
        bp1.alignment = PP_ALIGN.CENTER
        bp2 = btf.add_paragraph()
        bp2.text = v
        bp2.font.size = Pt(12)
        bp2.font.bold = True
        bp2.font.color.rgb = WHITE
        bp2.alignment = PP_ALIGN.CENTER

    # ==========================================
    # SLIDE 2: The Problem
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "Problem Space", "Why Modern Kids' Web Games Are Broken", "Analyzing the current state of online games aimed at ages 7-12")

    cards_s2 = [
        ("Intrusive Ads & Dark Patterns", "Most web games force full-screen 30-second video ads, deceptive click buttons, and in-app purchase traps that disrupt young players' attention.", ORANGE),
        ("Framework Bloat & Lag", "Heavy engines (heavy Unity WebGL exports, 15MB React bundles) take 20+ seconds to load and drop frames on budget school Chromebooks and phones.", CYAN),
        ("Unplayable AI 'Slop'", "Generic template clones flood the web with broken mobile touch gestures, clunky emoji overload, and shallow non-responsive gameplay loops.", RGBColor(247, 37, 133)),
        ("Zero Educational Value", "Games lack positive reinforcement, mental reflex training, or real-world scientific curiosity, offering mindless slot-machine mechanics instead.", GOLD)
    ]

    for i, (title, desc, color) in enumerate(cards_s2):
        c = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 2.98), Inches(2.3), Inches(2.8), Inches(4.5))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = color
        c.line.width = Pt(1.5)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_top = Inches(0.3)
        ctf.margin_left = Inches(0.25)
        ctf.margin_right = Inches(0.25)

        p = ctf.paragraphs[0]
        p.text = f"0{i+1}"
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = color
        p.font.name = "Arial"

        p_t = ctf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE
        p_t.space_before = Pt(14)

        p_d = ctf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = MUTED
        p_d.space_before = Pt(10)

    # ==========================================
    # SLIDE 3: The Solution - CosmicCadets
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "Our Solution", "CosmicCadets: Thoughtful, Tactile & Instant", "Re-imagining the kid-arcade experience with craftsmanship and care")

    sol_items = [
        ("Tactile 'Among Us' Micro-Tasks", "Quick, satisfying 20-45s missions that challenge coordination: dragging orbital trash, steering through asteroids, and tuning rocket thrusters.", CYAN),
        ("6 Daily Procedural Tasks", "A fresh mission lineup every single calendar day seeded by date. Players complete tasks to earn up to 18 daily stars and climb ranks.", GOLD),
        ("Zero Emojis, Pure SVG Icons", "Clean, custom vector icons and handcrafted visual art designed specifically for the cadet academy theme—no cheesy generic phone emojis.", GREEN),
        ("Real Space Science Facts", "Every day presents an astronomically verified space fact (from Olympus Mons to Venusian atmospheric physics) sparking genuine curiosity.", ORANGE)
    ]

    for i, (title, desc, color) in enumerate(sol_items):
        row = i // 2
        col = i % 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(2.2 + row * 2.4)
        c = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(2.15))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = color
        c.line.width = Pt(1.5)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_top = Inches(0.2)
        ctf.margin_left = Inches(0.3)
        ctf.margin_right = Inches(0.3)

        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = color

        p_d = ctf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = WHITE
        p_d.space_before = Pt(8)

    # ==========================================
    # SLIDE 4: The 6 Training Modules
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "Game Catalog", "Six Focused Space Training Minigames", "Each module reinforces motor reflexes, cognitive memory, or mechanical timing")

    games = [
        ("Laser Shoot", "WEAPONS", "Tap dynamic alien targets with twin lasers. Rewards combo streaks and rapid reaction speeds.", CYAN),
        ("Space Trash", "AIRLOCK", "Drag floating space junk into the disposal chute, then pull the manual airlock lever to flush it.", GREEN),
        ("Asteroid Dodge", "NAVIGATION", "Steer the scout ship left and right through dense asteroid belts while scooping up golden stars.", ORANGE),
        ("Ring Align", "ENGINES", "Precision timing: tap STOP precisely when the gyro needle aligns inside the green tolerance zone.", GOLD),
        ("Rocket Boost", "THRUSTERS", "Hold BOOST to keep the ascent rocket stabilized inside the dynamically shifting green zone.", RGBColor(247, 37, 133)),
        ("Code Match", "REACTOR", "Listen and observe colored reactor light codes, then replicate the sequence without errors.", RGBColor(180, 100, 255))
    ]

    for i, (name, dept, desc, color) in enumerate(games):
        col = i % 3
        row = i // 3
        x = Inches(0.8 + col * 3.98)
        y = Inches(2.2 + row * 2.45)
        c = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.8), Inches(2.2))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = color
        c.line.width = Pt(1.5)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_top = Inches(0.18)
        ctf.margin_left = Inches(0.25)
        ctf.margin_right = Inches(0.25)

        p = ctf.paragraphs[0]
        p.text = f"[{dept}]  {name}"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = color

        p_d = ctf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11.5)
        p_d.font.color.rgb = WHITE
        p_d.space_before = Pt(8)

    # ==========================================
    # SLIDE 5: Technical Architecture
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "Engineering", "High-Performance Zero-Dependency Stack", "Built without frameworks to achieve lightning-fast 60 FPS performance anywhere")

    tech_cards = [
        ("Vanilla JS & Canvas", "HTML5 Canvas + requestAnimationFrame pipeline. No heavy game frameworks (no Phaser/Pixi). Renders hundreds of space particles at steady 60 FPS.", CYAN),
        ("Synthesized Web Audio", "Zero sound assets downloaded! Custom audio engine uses Web Audio API OscillatorNode & GainNode to synthesize lasers, thrust hums, and chimes in real-time.", GOLD),
        ("Deterministic Daily RNG", "Linear congruential hashing seeds the daily tasks and featured bonus games based on calendar dates. Every cadet worldwide shares identical tasks each day.", GREEN),
        ("Robust Dual-Mode Storage", "Local-first architecture via localStorage for offline play, with clean serverless API hooks (/api/leaderboard) for Upstash Redis cloud leaderboards.", ORANGE)
    ]

    for i, (title, desc, color) in enumerate(tech_cards):
        c = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 2.98), Inches(2.3), Inches(2.8), Inches(4.5))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = color
        c.line.width = Pt(1.5)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_top = Inches(0.3)
        ctf.margin_left = Inches(0.25)
        ctf.margin_right = Inches(0.25)

        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = color

        p_d = ctf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = WHITE
        p_d.space_before = Pt(14)

    # ==========================================
    # SLIDE 6: Mobile & PWA Offline Engine
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "Accessibility & PWA", "Mobile-First Touch & True Offline Capability", "Designed so students can play anywhere, even on spotty school bus Wi-Fi")

    features = [
        ("Pointer-Capture Controls", "Touch gestures on mobile use PointerEvents with setPointerCapture. No missed drags, no sticky drag drops, and no accidental browser zoom or scroll."),
        ("Network-First Service Worker", "Assets are cached intelligently. If online, players always receive the freshest code; if offline, the service worker immediately boots the full game suite."),
        ("Zero-Latency Instant Start", "The entire application bundle is under 150KB uncompressed. Loads in under 200ms on 3G connections with a 100/100 Lighthouse performance score."),
        ("Full PWA Installability", "Complies with modern web manifest standards. Can be installed directly to home screens on iOS Safari, Android Chrome, and Windows/Mac desktop.")
    ]

    for i, (title, desc) in enumerate(features):
        y = Inches(2.2 + i * 1.15)
        c = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.733), Inches(0.98))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CYAN if i % 2 == 0 else GOLD
        c.line.width = Pt(1.2)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.3)
        ctf.margin_top = Inches(0.18)

        p = ctf.paragraphs[0]
        p.text = f"{title}:  "
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = CYAN if i % 2 == 0 else GOLD

        p_run = p.add_run()
        p_run.text = desc
        p_run.font.size = Pt(12.5)
        p_run.font.bold = False
        p_run.font.color.rgb = WHITE

    # ==========================================
    # SLIDE 7: Competition Impact & Metrics
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "Competition Value", "Evaluation Criteria Alignment", "How CosmicCadets excels across technical, creative, and practical judging metrics")

    metrics = [
        ("100 / 100", "Lighthouse Performance", "Sub-150KB total bundle size with zero external npm runtimes.", CYAN),
        ("6 Modules", "Daily Arcade Variety", "Reflex, timing, memory, and physics-based recycling games.", GOLD),
        ("0 Emojis", "Handcrafted Art & UI", "Clean inline vector SVGs, dark space palette & kid-friendly typography.", GREEN),
        ("100% Free", "Deployment Ready", "Runs on local Node server or free Vercel Edge with zero hosting fees.", ORANGE)
    ]

    for i, (val, label, sub, color) in enumerate(metrics):
        c = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 2.98), Inches(2.3), Inches(2.8), Inches(4.5))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = color
        c.line.width = Pt(1.5)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_top = Inches(0.4)
        ctf.margin_left = Inches(0.25)
        ctf.margin_right = Inches(0.25)

        p = ctf.paragraphs[0]
        p.text = val
        p.font.size = Pt(32)
        p.font.bold = True
        p.font.color.rgb = color
        p.font.name = "Arial"

        p_l = ctf.add_paragraph()
        p_l.text = label
        p_l.font.size = Pt(16)
        p_l.font.bold = True
        p_l.font.color.rgb = WHITE
        p_l.space_before = Pt(14)

        p_s = ctf.add_paragraph()
        p_s.text = sub
        p_s.font.size = Pt(12)
        p_s.font.color.rgb = MUTED
        p_s.space_before = Pt(10)

    # ==========================================
    # SLIDE 8: Summary & Q&A
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)

    box_end = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.0), Inches(11.733), Inches(5.5))
    box_end.fill.solid()
    box_end.fill.fore_color.rgb = CARD_BG
    box_end.line.color.rgb = GOLD
    box_end.line.width = Pt(1.5)

    tf8 = box_end.text_frame
    tf8.word_wrap = True
    tf8.margin_left = Inches(0.8)
    tf8.margin_top = Inches(0.8)
    tf8.margin_right = Inches(0.8)

    p = tf8.paragraphs[0]
    p.text = "CONCLUSION & DEMO"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = CYAN

    p2 = tf8.add_paragraph()
    p2.text = "CosmicCadets: Ready for Launch"
    p2.font.size = Pt(40)
    p2.font.bold = True
    p2.font.color.rgb = GOLD
    p2.space_before = Pt(10)

    p3 = tf8.add_paragraph()
    p3.text = "A proof of what modern web technology can achieve when prioritized for speed, ethics, and child safety. Pure code, tactile delight, and positive space learning every day."
    p3.font.size = Pt(16)
    p3.font.color.rgb = WHITE
    p3.space_before = Pt(12)

    p4 = tf8.add_paragraph()
    p4.text = "GitHub: github.com/sharshadalatheef/CosmicCadets\nPlay Live on Localhost / Vercel Edge\n\nThank you! Questions & Live Demo."
    p4.font.size = Pt(15)
    p4.font.bold = True
    p4.font.color.rgb = CYAN
    p4.space_before = Pt(24)

    prs.save(filename)
    print(f"Successfully generated: {filename}")

if __name__ == "__main__":
    out_name = sys.argv[1] if len(sys.argv) > 1 else "CosmicCadets_Presentation.pptx"
    create_deck(out_name)
