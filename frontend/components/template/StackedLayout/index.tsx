import { Fragment, createContext, useState, useEffect, ReactNode } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Configuration from '@/services/lib/config';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const LayoutContext = createContext({});

interface StackedLayoutProps {
  moduleInformation?: any; // Type this based on what moduleInformation actually is
  children: ReactNode;
}

interface NavigationItem {
  role: string[];
  name: string;
  href: string;
  moduleId?: string;
  current: boolean;
}

export function StackedLayoutWrapper({ moduleInformation, children }: StackedLayoutProps) {
  let user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }

  let navigation = [
    { role: ["ADMIN", "USER"], name: 'Início', href: '/workspace', moduleId: "home", current: false },
    { role: ["ADMIN", "USER"], name: 'Comunicados', href: '/workspace/comunications', moduleId: "comunications", current: false },
    { role: ["ADMIN"], name: 'Usuários', href: '/workspace/users', moduleId: "users", current: false },
    { role: ["ADMIN"], name: 'Empresas Incubadas', href: '/workspace/companies', current: false },
    { role: ["ADMIN", "USER"], name: 'Dados', href: '/workspace/data', current: false },
    { role: ["ADMIN"], name: 'Indicadores', href: '/workspace/indicator', current: false },
    { role: ["ADMIN", "USER"], name: 'Paineis', href: '/workspace/dashboards', current: false },
    // { role: ["ADMIN", "USER"], name: 'Entregáveis', href: '/workspace/deliverables', current: false },
    { role: ["ADMIN"], name: 'Registros', href: '/workspace/registers', current: false },
  ]

  let userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#', onClick: () => { signOut() } },
  ]

  navigation.map((navigationInfo) => {
    if(window.location.pathname == navigationInfo.href){
      navigationInfo.current = true;
    }
  })

  if((moduleInformation && moduleInformation.moduleExists)){
    let moduleId = moduleInformation.moduleId

    navigation.map((navigationInfo) => {
      if(navigationInfo.moduleId == moduleId){
        navigationInfo.current = true;
      }
    })
  }

  const axiosConfig = () => {
    const token = localStorage.getItem('token');
    
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  };

  interface UserData {
    loading: boolean;
    user?: {
      role: string;
      companyId: string; // ou o tipo que você espera para companyId
      // adicione quaisquer outras propriedades que você espera que o objeto 'user' contenha
    };
    // adicione quaisquer outras propriedades que você espera que userData contenha
  }  

  const [userData, setUserData] = useState<UserData>({ loading: true });

  useEffect(() => {
    axios.get(`${Configuration.backendEndpoint + '/getUserData'}`, axiosConfig())
      .then(response => {
        let user = response.data;
        setUserData(user)
        localStorage.setItem('ROLE', response.data.user.role)
        localStorage.setItem('COMPANY_ID', response.data.user.companyId)
      })
      .catch(error => signOut());
  }, []);

  return !userData.loading && (
    <>
      <div className="min-h-full">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src="/iidv.png"
                          alt="Your Company"
                          width={100}
                          height={30}
                        />
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                          {navigation.map((item) => item.role.includes(userData.user.role) && (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium'
                              )}
                              aria-current={item.current ? 'page' : undefined}
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        <button
                          type="button"
                          onClick={signOut}
                          className="ml-3 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:bg-red-800"
                        >
                          Sair
                        </button>
                      </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="md:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block rounded-md px-3 py-2 text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 pb-3 pt-4">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full"  alt="" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">{user.name}</div>
                        <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                      </div>
                      <button
                        type="button"
                        className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          
          {children}
        </div>
    </>
  );
}

function signOut(){
  localStorage.clear()
  window.location.href = ('/auth');
}

interface StackedLayoutWrapperProps {
  children: ReactNode;
  moduleInformation?: any; // Type this based on what moduleInformation actually is
}


interface UserDataToken {
  loading: boolean;
  token: string
}  

export default function StackedLayout({ children, moduleInformation }: StackedLayoutWrapperProps) {
 const [moduleInformationData, setModuleInformationData] = useState(false);
 const [userInfo, setUserInfo] = useState<UserDataToken>({ loading: true, token: ""});

  useEffect(() => {
    if(!localStorage.getItem('token')){
      signOut();
    } else {
      setUserInfo({ token: localStorage.getItem('token'), loading: false }) 
    }
  }, []);

  return !userInfo.loading && (
    <LayoutContext.Provider value={[moduleInformationData, setModuleInformationData]}>
      <StackedLayoutWrapper moduleInformation={moduleInformationData}>
        {children}
      </StackedLayoutWrapper>
    </LayoutContext.Provider>
  )
}
