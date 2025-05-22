'use client';

import Content from "@/components/template/Content";
import PageListItems from "@/components/template/Page/ListItens";
import { useEffect, useState } from "react";

export default function DataPage() {
// Atualize os cabeçalhos para incluir o nome do pacote de dados, descrição e data de adição, além do e-mail e função (role)
const headersData = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nome do Pacote de Dados' },
  { key: 'data', label: 'Dados', type: 'CSVtoJSON' },
  { key: 'created_at', label: 'Data de Adição', editable: false },
  { key: 'companyId', label: 'ID de Empresa', isCompany: true  },
];

  return (
    <>
      <Content headerTitle={'Dados de Performance'}>
        <PageListItems 
            endpoint="/dataset"  // Substitua pelo seu endpoint real
            headers={headersData}
            createButtonText="Novo"
          />
      </Content>
    </>
  )
}
