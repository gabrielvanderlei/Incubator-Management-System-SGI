'use client';

import Content from "@/components/template/Content";
import PageListItems from "@/components/template/Page/ListItens";
import { useEffect, useState } from "react";

export default function IndicatorPage() {
// Atualize os cabeçalhos para incluir informações sobre os indicadores
const headersData = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nome' },
  { key: 'graph', label: 'Tipo de Gráfico' }, //ex. BAR
  { key: 'accumulationType', label: 'Tipo de Acumulação' }, // ex. UNIQUE
  { key: 'formulaData', label: 'Fórmula', type: 'CSVtoJSON' },
  { key: 'equivalentFieldsData', label: 'Campos Equivalentes no Dataset', type: 'CSVtoJSON' },
];

  return (
    <>
      <Content headerTitle={`Indicadores de Performance (KPI's)`}>
        <PageListItems 
            endpoint="/indicator"  // Substitua pelo seu endpoint real
            headers={headersData}
            createButtonText="Novo"
          />
      </Content>
    </>
  )
}
