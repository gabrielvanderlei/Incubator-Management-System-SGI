import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import Content from '@/components/template/Content';

export default function ListContent({ moduleInformation, children }) {
  return (
    <>
      {moduleInformation.moduleExists ? 
        (
          <Content headerTitle={moduleInformation.moduleData.title}>
            {children}
          </Content>
        ) : (
          <div>
            <Content headerTitle="Módulo não encontrado" />
          </div>
        )
      }
    </>
  )
}
