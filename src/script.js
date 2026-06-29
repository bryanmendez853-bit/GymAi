// ====== PASO 1: LOS IMPORTS SIEMPRE VAN EN LA LÍNEA 1 ======
import { GoogleGenAI } from "https://esm.run/@google/genai";

// ====== PASO 2: INICIALIZAR LA API FUERA DE LA FUNCIÓN ======
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6IxZ4AqEHBYvAiDGTpaVRQJsq4ayRUGsmbEwfr4NsOR3A" }); // Pega aquí tu clave completa real

// ====== PASO 3: OBTENER LOS ELEMENTOS DEL HTML ======
const edadInput = document.getElementById('edad');
const pesoInput = document.getElementById('peso');
const alturaInput = document.getElementById('altura');
const sexoSelect = document.getElementById('sexo');
const objetivoSelect = document.getElementById('objetivo');
const nivelSelect = document.getElementById('nivel');
const diasSelect = document.getElementById('dias');
const resultadoDiv = document.getElementById('resultado');
const botonGenerar = document.getElementById('generar');

// ====== PASO 4: VINCULAR EL EVENTO CLICK AL BOTÓN ======
botonGenerar.addEventListener('click', generarRutina);

// ====== PASO 5: LA FUNCIÓN ASÍNCRONA ======
async function generarRutina() {
    // Convertimos directamente a números para poder validarlos matemáticamente
    const edad = parseInt(edadInput.value.trim(), 10);
    const peso = parseFloat(pesoInput.value.trim());
    const altura = parseFloat(alturaInput.value.trim());
    const sexo = sexoSelect.value;
    const objetivo = objetivoSelect.value;
    const nivel = nivelSelect.value;
    const dias = diasSelect.value;

    // 1. Validación de campos vacíos
    if (!edadInput.value || !pesoInput.value || !alturaInput.value) {
        resultadoDiv.innerHTML = `<div class="alert alert-danger">Por favor, completa la edad, peso y altura.</div>`;
        return;
    }

    // 2. Validación estricta contra ceros y números negativos
    if (edad <= 0 || peso <= 0 || altura <= 0) {
        resultadoDiv.innerHTML = `
            <div class="alert alert-warning">
                <strong>Datos inválidos:</strong> La edad, el peso y la altura deben ser mayores a cero. ¡Nadie tiene un cuerpo físico de 0 kg!
            </div>
        `;
        return;
    }

    // Estado de carga usando clases de Bootstrap
    resultadoDiv.innerHTML = `
        <div class="d-flex align-items-center gap-2 text-primary">
            <div class="spinner-border spinner-border-sm" role="status"></div>
            <span>GymAI está diseñando tu rutina personalizada... Por favor espera.</span>
        </div>
    `;

    // Construcción del Prompt estructurado
    const prompt = `Actúa como un entrenador personal experto y certificado. Genera una rutina de gimnasio altamente personalizada utilizando exactamente los siguientes datos:
    - Edad: ${edad} años
    - Peso: ${peso} kg
    - Altura: ${altura} cm
    - Sexo: ${sexo}
    - Objetivo principal: ${objetivo}
    - Nivel de experiencia: ${nivel}
    - Disponibilidad: ${dias} días por semana

    Por favor, estructura la respuesta de forma clara. Divide el contenido por días usando títulos en negrita, detallando ejercicios, series, repeticiones y descansos recomendados acordes al nivel ${nivel}. Evita introducciones innecesarias y ve directo a la rutina.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let textoFormateado = response.text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 

        resultadoDiv.innerHTML = `<div class="lh-base">${textoFormateado}</div>`;

    } catch (error) {
        console.error("Error al conectar con la API de Gemini:", error);
        resultadoDiv.innerHTML = `
            <div class="alert alert-danger">
                <strong>Error:</strong> No se pudo conectar con GymAI. Verifica tu conexión o tu API Key.
            </div>
        `;
    }
}