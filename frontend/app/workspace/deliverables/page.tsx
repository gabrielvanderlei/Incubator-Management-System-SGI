'use client';

import Content from "@/components/template/Content";
import PageListItems from "@/components/template/Page/ListItens";

export default function DeliverablesPage() {
  const headersData = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Título' },
    { key: 'status', label: 'Status' },
    { key: 'companyId', label: 'ID de Empresa', isCompany: true  },
  ];
  
  return (
    <>
      <Content headerTitle={'Entregáveis'}>
        <PageListItems 
            endpoint="/deliverable"  // Substitua pelo seu endpoint real
            headers={headersData}
            createButtonText="Novo"
          />
      </Content>
    </>
  )
}
