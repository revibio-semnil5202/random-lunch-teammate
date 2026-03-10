export const SPREADSHEET_ID = "1B7edXR30R0w3tEZu8bg1yFuBUvHrByV10UiqZ_r_LXs";
export const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

export interface Restaurant {
  name: string;
  category: string;
  mealSupport: string;
  naverMapLink: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    throw new Error("Google Sheets 데이터를 불러올 수 없습니다.");
  }

  const csv = await res.text();
  const lines = csv.split("\n").filter((line) => line.trim());

  // Skip header row
  const dataLines = lines.slice(1);

  return dataLines.map((line) => {
    const [name, category, mealSupport, naverMapLink] = parseCSVLine(line);
    return {
      name: name || "",
      category: category || "",
      mealSupport: mealSupport || "",
      naverMapLink: naverMapLink || "",
    };
  });
}
