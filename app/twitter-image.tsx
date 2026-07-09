import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SkillQuest - Adventurer's Guild & RPG Quest Registry";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#122017",
          backgroundImage: "linear-gradient(135deg, #1e3a29 0%, #122017 50%, #0d1912 100%)",
          padding: "36px",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Outer Gold Ornamental Frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            border: "12px solid #d4af37",
            borderRadius: "32px",
            backgroundColor: "rgba(22, 42, 30, 0.85)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
            position: "relative",
            overflow: "hidden",
            padding: "48px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Inner Filigree Dashed Ring */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              right: "16px",
              bottom: "16px",
              border: "3px dashed rgba(212, 175, 55, 0.35)",
              borderRadius: "20px",
              display: "flex",
            }}
          />

          {/* Left Side: Large Shield Emblem */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "380px",
              height: "380px",
              position: "relative",
            }}
          >
            {/* SVG Shield & Crest */}
            <svg
              width="340"
              height="340"
              viewBox="0 0 512 512"
              style={{
                filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.85))",
              }}
            >
              {/* Outer Golden Shield Base */}
              <path
                d="M 256 84 C 340 84, 396 108, 412 124 C 412 260, 370 356, 256 428 C 142 356, 100 260, 100 124 C 116 108, 172 84, 256 84 Z"
                fill="#f5d77f"
              />
              {/* Inner Dark Shield Core */}
              <path
                d="M 256 106 C 326 106, 374 126, 388 140 C 388 252, 350 334, 256 398 C 162 334, 124 252, 124 140 C 138 126, 186 106, 256 106 Z"
                fill="#162a1e"
              />
              {/* Crossed Swords */}
              <g stroke="#d4af37" strokeWidth="16" strokeLinecap="round">
                <line x1="170" y1="310" x2="342" y2="160" />
                <line x1="342" y1="310" x2="170" y2="160" />
              </g>
              {/* Center Golden Star */}
              <polygon
                points="256,160 276,215 332,215 288,250 304,305 256,270 208,305 224,250 180,215 236,215"
                fill="#f5d77f"
                stroke="#140f07"
                strokeWidth="6"
              />
              {/* Center Emerald Jewel */}
              <polygon
                points="256,195 268,225 298,225 274,242 284,272 256,254 228,272 238,242 214,225 244,225"
                fill="#10b981"
              />
            </svg>
          </div>

          {/* Right Side Typography & Badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              marginLeft: "36px",
              zIndex: 10,
            }}
          >
            {/* Tag Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff8ea",
                border: "2px solid #8c6239",
                borderRadius: "999px",
                padding: "8px 24px",
                width: "280px",
                marginBottom: "20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#5c3a1a",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                ADVENTURER&apos;S GUILD
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 78,
                fontWeight: 900,
                color: "#f5d77f",
                margin: "0 0 16px 0",
                lineHeight: 1.05,
                letterSpacing: "1px",
                textShadow: "0 4px 12px rgba(0,0,0,0.8)",
              }}
            >
              SkillQuest
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "#fff8ea",
                margin: "0 0 12px 0",
              }}
            >
              The RPG Quest Board &amp; Bounty Registry
            </p>
            <p
              style={{
                fontSize: 22,
                fontStyle: "italic",
                color: "#c2b59b",
                margin: "0 0 36px 0",
                lineHeight: 1.4,
              }}
            >
              Level up real-world skills, seal visual proof of deeds, &amp; earn guild prestige with fellow adventurers.
            </p>

            {/* Feature Badges Across Bottom */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1b3626",
                  border: "2px solid #d4af37",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 700, color: "#f5d77f" }}>
                  +500 XP Bounties
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1b3626",
                  border: "2px solid #d4af37",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 700, color: "#f5d77f" }}>
                  Live Chronicle
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1b3626",
                  border: "2px solid #d4af37",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 700, color: "#f5d77f" }}>
                  Prestige Applause
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Right Watermark */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              right: "48px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#d4af37",
                letterSpacing: "1px",
              }}
            >
              skillquest.app
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
