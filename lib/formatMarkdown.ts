/**
 * Formats markdown content for display using Tailwind CSS classes
 * @param markdown The markdown string to format
 * @returns Formatted markdown with Tailwind CSS styling
 */
export function formatMarkdown(markdown: string): string {
  if (!markdown) return "";

  // Replace markdown headers
  let formatted = markdown
    .replace(/^# (.*$)/gm, '<div class="text-2xl font-bold my-4">$1</div>')
    .replace(/^## (.*$)/gm, '<div class="text-xl font-bold my-3">$1</div>')
    .replace(/^### (.*$)/gm, '<div class="text-lg font-bold my-2">$1</div>');

  // Replace bold and italic
  formatted = formatted
    .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
    .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');

  // Replace lists
  formatted = formatted
    .replace(
      /^\s*\* (.*$)/gm,
      '<div class="ml-4 before:content-["•"] before:mr-2">$1</div>'
    )
    .replace(
      /^\s*- (.*$)/gm,
      '<div class="ml-4 before:content-["•"] before:mr-2">$1</div>'
    )
    .replace(
      /^\s*\d+\. (.*$)/gm,
      '<div class="ml-4 flex"><span class="mr-2">$&.</span><span>$1</span></div>'
    );

  // Replace code blocks
  formatted = formatted
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 p-4 rounded my-2 overflow-x-auto"><code>$1</code></pre>'
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>'
    );

  // Handle tables
  if (formatted.includes("|")) {
    const tableRows = formatted
      .split("\n")
      .filter((line) => line.includes("|"));
    if (tableRows.length > 2) {
      const tableHTML =
        '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse">';
      const headerRow = tableRows[0];
      const separatorRow = tableRows[1];
      const dataRows = tableRows.slice(2);

      // Process header
      const headers = headerRow.split("|").filter((cell) => cell.trim() !== "");
      const headerHTML =
        "<thead><tr>" +
        headers
          .map(
            (header) =>
              `<th class="border border-gray-300 px-4 py-2 bg-gray-50 font-medium">${header.trim()}</th>`
          )
          .join("") +
        "</tr></thead>";

      // Process data rows
      const bodyHTML =
        "<tbody>" +
        dataRows
          .map((row) => {
            const cells = row.split("|").filter((cell) => cell.trim() !== "");
            return (
              "<tr>" +
              cells
                .map(
                  (cell) =>
                    `<td class="border border-gray-300 px-4 py-2">${cell.trim()}</td>`
                )
                .join("") +
              "</tr>"
            );
          })
          .join("") +
        "</tbody>";

      const tableFullHTML =
        tableHTML + headerHTML + bodyHTML + "</table></div>";

      // Replace the table in the original text
      const tableRegex = new RegExp(
        tableRows.join("\n").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "g"
      );
      formatted = formatted.replace(tableRegex, tableFullHTML);
    }
  }

  // Replace line breaks but preserve paragraphs
  formatted = formatted
    .replace(/\n\s*\n/g, '</p><p class="my-2">') // Double line breaks become paragraphs
    .replace(/\n/g, "<br />"); // Single line breaks

  // Wrap in paragraph if not already wrapped
  if (!formatted.startsWith("<")) {
    formatted = `<p class="my-2">${formatted}</p>`;
  }

  return formatted;
}
