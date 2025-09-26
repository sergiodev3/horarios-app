import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Group } from '../types/group';
import type { Schedule, ShiftType } from '../types/schedule';
import { MORNING_SCHEDULE, AFTERNOON_SCHEDULE, DAYS } from '../types/schedule';

class PDFService {
  
  async generateSchedulePDF(
    group: Group,
    schedules: Schedule[],
    shift: ShiftType
  ): Promise<void> {
    try {
      // Crear elemento temporal para el PDF
      const pdfElement = this.createPDFElement(group, schedules, shift);
      document.body.appendChild(pdfElement);

      // Generar canvas del elemento
      const canvas = await html2canvas(pdfElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1200,
        height: 800
      });

      // Remover elemento temporal
      document.body.removeChild(pdfElement);

      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Descargar PDF
      const fileName = `horario_${group.name}_${shift === 'morning' ? 'matutino' : 'vespertino'}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generando PDF:', error);
      throw new Error('Error al generar el PDF del horario');
    }
  }

  private createPDFElement(
    group: Group,
    schedules: Schedule[],
    shift: ShiftType
  ): HTMLElement {
    const container = document.createElement('div');
    container.style.cssText = `
      width: 1200px;
      padding: 40px;
      background: white;
      font-family: 'Inter', Arial, sans-serif;
      position: absolute;
      top: -9999px;
      left: -9999px;
    `;

    const currentSchedule = shift === 'morning' ? MORNING_SCHEDULE : AFTERNOON_SCHEDULE;
    const shiftTitle = shift === 'morning' ? 'TURNO MATUTINO' : 'TURNO VESPERTINO';

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="
          font-size: 28px;
          font-weight: bold;
          color: #667eea;
          margin: 0 0 10px 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        ">${shiftTitle}</h1>
        <h2 style="
          font-size: 20px;
          color: #333;
          margin: 0 0 5px 0;
        ">Grupo: ${group.name}</h2>
        <h3 style="
          font-size: 16px;
          color: #666;
          margin: 0;
        ">Grado: ${group.grade}</h3>
      </div>

      <table style="
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        border-radius: 8px;
        overflow: hidden;
      ">
        <thead>
          <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <th style="
              padding: 15px;
              color: white;
              font-weight: bold;
              text-align: center;
              border-right: 1px solid rgba(255,255,255,0.2);
              min-width: 140px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            ">HORA</th>
            ${DAYS.map(day => `
              <th style="
                padding: 15px;
                color: white;
                font-weight: bold;
                text-align: center;
                border-right: 1px solid rgba(255,255,255,0.2);
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
              ">${day}</th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${currentSchedule.map((timeSlot) => {
            const isBreak = (shift === 'morning' && timeSlot.start === '09:40') ||
                           (shift === 'afternoon' && timeSlot.start === '15:40');
            
            if (isBreak) {
              return `
                <tr>
                  <td style="
                    padding: 15px;
                    background: #f8f9fa;
                    font-weight: bold;
                    color: #667eea;
                    text-align: center;
                    border: 1px solid #e0e0e0;
                  ">${timeSlot.display}</td>
                  <td colspan="5" style="
                    padding: 15px;
                    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
                    color: #f57c00;
                    font-weight: bold;
                    text-align: center;
                    border: 1px solid #ffb74d;
                  ">DESCANSO</td>
                </tr>
              `;
            }
            
            return `
              <tr>
                <td style="
                  padding: 15px;
                  background: #f8f9fa;
                  font-weight: bold;
                  color: #667eea;
                  text-align: center;
                  border: 1px solid #e0e0e0;
                ">${timeSlot.display}</td>
                ${DAYS.map(day => {
                  const schedule = schedules.find(s => s.day === day && s.hour === timeSlot.start);
                  
                  if (schedule) {
                    return `
                      <td style="
                        padding: 15px;
                        background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
                        border: 1px solid #4caf50;
                        text-align: center;
                        vertical-align: middle;
                      ">
                        <div style="
                          font-weight: bold;
                          color: #2e7d32;
                          margin-bottom: 5px;
                          font-size: 14px;
                        ">${schedule.subject_code}</div>
                        <div style="
                          color: #558b2f;
                          font-size: 12px;
                        ">${schedule.teacher_name}</div>
                      </td>
                    `;
                  } else {
                    return `
                      <td style="
                        padding: 15px;
                        background: white;
                        border: 1px solid #e0e0e0;
                        text-align: center;
                        vertical-align: middle;
                        color: #999;
                        font-style: italic;
                        font-size: 12px;
                      ">Libre</td>
                    `;
                  }
                }).join('')}
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div style="
        margin-top: 20px;
        font-size: 12px;
        color: #666;
        text-align: center;
      ">
        Generado el ${new Date().toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} - Sistema de Gestión de Horarios
      </div>
    `;

    return container;
  }
}

export const pdfService = new PDFService();