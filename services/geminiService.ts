
/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";
import { JiraTask } from "../types";

export async function generateReleaseSummary(tasks: JiraTask[]): Promise<string> {
  // Tarayıcıda `process` tanımlı olmadığı için doğrudan erişim ReferenceError atar
  // ve aşağıdaki anlamlı hata mesajı hiç gösterilemez. Güvenli erişim kullanılıyor.
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    (globalThis as any).process?.env?.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API anahtarı bulunamadı. Proje kökünde .env.local dosyası oluşturup " +
        "VITE_GEMINI_API_KEY değerini girin (örnek için .env.example dosyasına bakın)."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Aşağıdaki Jira kayıtlarına göre profesyonel bir sürüm özeti oluştur.
    Özet, yeni eklenen özellikleri ve düzeltilen hataları içermelidir.
    
    Kayıtlar:
    ${JSON.stringify(tasks, null, 2)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
  });

  return response.text || "Özet oluşturulamadı.";
}
