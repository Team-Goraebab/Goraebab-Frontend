'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import { MENU_ITEMS } from '@/data/menu';
import { useMenuStore } from '@/store/menuStore';
import { FiSettings, FiGrid } from 'react-icons/fi';
import { FaQuestion } from 'react-icons/fa';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { activeId, setActiveId } = useMenuStore();
  const [barWidth, setBarWidth] = useState(0);
  const [barLeft, setBarLeft] = useState(0);

  const isRightSidePath =
    pathname === '/management' || pathname === '/dashboard';

  const handleNavigation = (path: string, id: number) => {
    setActiveId(id);
    router.push(path);
  };

  useEffect(() => {
    if (navRef.current) {
      const activeIndex = MENU_ITEMS.findIndex((item) => item.id === activeId);
      if (activeIndex !== -1) {
        const activeItem = navRef.current.children[activeIndex];
        if (activeItem) {
          setBarWidth(activeItem.clientWidth);
          setBarLeft(
            activeItem.getBoundingClientRect().left -
            navRef.current.getBoundingClientRect().left,
          );
        }
      }
    }
  }, [activeId, isRightSidePath]);

  return (
    <header
      className="fixed top-3 left-1/2 transform -translate-x-1/2 w-auto max-w-3xl bg-blue_6 text-white z-30 rounded-full shadow-lg overflow-hidden">
      <div
        ref={headerRef}
        className="transition-all duration-500 ease-in-out"
      >
        <div className={`relative py-4 px-8`}>
          <div className={`flex items-center justify-between`}>
            <nav
              className="flex space-x-6 relative items-center justify-center"
              ref={navRef}
            >
              {MENU_ITEMS.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigation(item.path, item.id)}
                  className={`flex flex-col items-center cursor-pointer font-semibold text-sm transition-colors duration-300 ${
                    activeId === item.id && !isRightSidePath
                      ? 'text-blue-400'
                      : 'text-white hover:text-white'
                  }`}
                  data-tooltip-id={`tooltip-${item.name}`}
                  data-tooltip-content={item.name}
                >
                  <item.icon className="text-xl mb-1" />
                  <Tooltip id={`tooltip-${item.name}`} />
                </div>
              ))}
            </nav>
            <div className="h-8 border-l border-white mx-4" />
            <div className="flex items-center space-x-4">
              <div
                onClick={() => handleNavigation('/dashboard', 5)}
                className={`cursor-pointer text-white hover:text-white transition-colors duration-300 ${
                  pathname === '/dashboard' ? 'text-blue-400' : ''
                }`}
              >
                <FiGrid className="text-xl" data-tooltip-id="dashboard-tooltip" />
                <Tooltip id="dashboard-tooltip" content="Dashboard" />
              </div>
              <div
                onClick={() => handleNavigation('/management', 6)}
                className={`cursor-pointer text-white hover:text-white transition-colors duration-300 ${
                  pathname === '/management' ? 'text-blue-400' : ''
                }`}
              >
                <FiSettings className="text-xl" data-tooltip-id="management-tooltip" />
                <Tooltip id="management-tooltip" content="Management" />
              </div>
              <div
                onClick={() => {
                }}
                className={`cursor-pointer text-white hover:text-white transition-colors duration-300`}
              >
                <FaQuestion className="text-xl" data-tooltip-id="guide" />
                <Tooltip id="guide" content="Help" />
              </div>
            </div>
          </div>
          {!isRightSidePath && (
            <div
              className="absolute bottom-0 h-1 bg-blue-400 rounded-tl rounded-tr transition-all duration-500"
              style={{
                width: `${barWidth}px`,
                left: `${barLeft + 32}px`,
                bottom: 0,
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
