import { useEffect } from 'react';
import mermaid from 'mermaid';

const MermaidRenderer = () => {
  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#10b981', // emerald-500
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#10b981',
        lineColor: '#6b7280',
        secondaryColor: '#374151',
        tertiaryColor: '#1f2937',
        background: '#111827',
        mainBkg: '#1f2937',
        secondBkg: '#374151',
        tertiaryBkg: '#4b5563',
        nodeBkg: '#1f2937',
        nodeBorder: '#10b981',
        clusterBkg: '#374151',
        clusterBorder: '#6b7280',
        defaultLinkColor: '#6b7280',
        titleColor: '#ffffff',
        edgeLabelBackground: '#1f2937',
        actorBkg: '#1f2937',
        actorBorder: '#10b981',
        actorTextColor: '#ffffff',
        actorLineColor: '#6b7280',
        signalColor: '#10b981',
        signalTextColor: '#ffffff',
        labelBoxBkgColor: '#1f2937',
        labelBoxBorderColor: '#10b981',
        labelTextColor: '#ffffff',
        taskBkgColor: '#1f2937',
        taskTextColor: '#ffffff',
        taskTextLightColor: '#9ca3af',
        taskTextOutsideColor: '#ffffff',
        taskTextClickableColor: '#10b981',
        activeTaskBkgColor: '#10b981',
        activeTaskBorderColor: '#059669',
        gridColor: '#374151',
        section0: '#1f2937',
        section1: '#374151',
        section2: '#4b5563',
        section3: '#6b7280',
        altSection: '#1f2937',
        activetaskBorderColor: '#059669',
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
      },
      gantt: {
        useMaxWidth: true,
      },
    });

    // Find all mermaid divs and render them
    const mermaidDivs = document.querySelectorAll('.mermaid');
    mermaidDivs.forEach(async (div, index) => {
      if (div.dataset.rendered) return; // Skip already rendered diagrams
      
      try {
        const chart = div.textContent || div.dataset.chart;
        if (chart) {
          const { svg } = await mermaid.render(`mermaid-${Date.now()}-${index}`, chart);
          div.innerHTML = svg;
          div.dataset.rendered = 'true';
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        div.innerHTML = `<div class="text-red-500 p-4 border border-red-500 rounded">Error rendering diagram: ${error.message}</div>`;
        div.dataset.rendered = 'true';
      }
    });
  }, []);

  return null; // This component doesn't render anything itself
};

export default MermaidRenderer;
