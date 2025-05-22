'use client';

import Content from "@/components/template/Content";
import PageListItems from "@/components/template/Page/ListItens";

export default function DashboardPage() {
  const headersData = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome da Empresa' },
  ];

  return (
    <>
      <Content headerTitle={'Empresas Incubadas'}>
        <PageListItems 
            endpoint="/company"  // Substitua pelo seu endpoint real
            headers={headersData}
            createButtonText="Novo"
          />
      </Content>
    </>
  );
}
