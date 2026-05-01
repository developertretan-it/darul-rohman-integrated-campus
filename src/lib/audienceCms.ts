import type { Role } from "@/data/authMock";
import type { CMSPost } from "@/data/cmsMock";
import type { UnitKey } from "@/data/mockData";

/**
 * Aturan visibility CMS:
 * 1. Hanya post berstatus "published".
 * 2. Tag unit (mi/smp/smk) bisa ditulis admin di body, contoh: "[unit:mi]" atau
 *    "[unit:all]". Jika tidak ada tag, fallback ke deteksi keyword.
 * 3. Tag audience: "[audience:siswa]", "[audience:wali]", "[audience:staff]",
 *    "[audience:all]". Tanpa tag = "all".
 * 4. Role mapping:
 *    - super_admin / admin_* / guru => "staff"
 *    - siswa => "siswa"
 *    - wali  => "wali"
 */

export type AudienceGroup = "staff" | "all";

export function roleToAudience(role: Role | undefined): AudienceGroup {
  if (!role) return "all";
  return "staff";
}

const UNIT_KEYWORDS: Record<UnitKey, string[]> = {
  mi: ["mi ", " mi", "tahfidz", "santri", "ibtidaiyah", "madrasah"],
  smp: ["smp", "menengah pertama"],
  smk: ["smk", "rpl", "tkj", "kejuruan", "industri", "coding"],
};

const GLOBAL_KEYWORDS = ["ppdb", "yayasan", "seluruh unit", "seluruh civitas"];

function readTag(text: string, key: string): string | null {
  const m = text.match(new RegExp(`\\[${key}:([a-z_]+)\\]`, "i"));
  return m ? m[1].toLowerCase() : null;
}

export function isPostVisible(
  post: CMSPost,
  unit: UnitKey,
  role: Role | undefined,
): boolean {
  if (post.status !== "published") return false;

  const haystack = `${post.judul} ${post.isi}`.toLowerCase();

  // ---- Audience check ----
  const audTag = readTag(haystack, "audience") as AudienceGroup | null;
  const audience = audTag ?? "all";
  const userAud = roleToAudience(role);
  if (audience !== "all" && audience !== userAud) return false;

  // ---- Unit check ----
  const unitTag = readTag(haystack, "unit");
  if (unitTag) {
    if (unitTag !== "all" && unitTag !== unit) return false;
  } else {
    // Fallback heuristik: cocokkan keyword unit / global.
    const isGlobal = GLOBAL_KEYWORDS.some((k) => haystack.includes(k));
    const isUnit = UNIT_KEYWORDS[unit].some((k) => haystack.includes(k));
    // Jika konten tidak menyebut unit lain secara eksplisit, anggap relevan.
    const mentionsOtherUnit = (Object.keys(UNIT_KEYWORDS) as UnitKey[])
      .filter((u) => u !== unit)
      .some((u) => UNIT_KEYWORDS[u].some((k) => haystack.includes(k)));

    if (!isGlobal && !isUnit && mentionsOtherUnit) return false;
  }

  return true;
}

export function filterPosts(
  posts: CMSPost[],
  unit: UnitKey,
  role: Role | undefined,
): CMSPost[] {
  return posts.filter((p) => isPostVisible(p, unit, role));
}
