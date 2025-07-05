// src/components/common/TimezoneCombobox.tsx
import { useState, useMemo, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import { useDebounce } from '../../hooks/useDebounce';

const useGroupedTimezones = () => {
  return useMemo(() => {
    const timezones = Intl.supportedValuesOf('timeZone');
    const grouped: { [key: string]: string[] } = {};
    timezones.forEach(tz => {
      const parts = tz.split('/');
      const region = parts[0];
      if (parts.length < 2 || !/^[A-Z]/.test(region)) {
        if (!grouped['Other']) grouped['Other'] = [];
        grouped['Other'].push(tz);
      } else {
        if (!grouped[region]) grouped[region] = [];
        grouped[region].push(tz); // Store the FULL timezone string
      }
    });
    return grouped;
  }, []);
};

interface TimezoneComboboxProps {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
}

export const TimezoneCombobox = ({ value, onChange, isOpen }: TimezoneComboboxProps) => {
  const timezonesByRegion = useGroupedTimezones();
  const regions = Object.keys(timezonesByRegion).sort();

  const [selectedRegion, setSelectedRegion] = useState<string>('America');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  // This effect correctly sets the initial state ONLY when the modal opens
  useEffect(() => {
    if (isOpen) {
      const [region] = value.split('/');
      if (regions.includes(region)) {
        setSelectedRegion(region);
      } else {
        setSelectedRegion('Other');
      }
      setQuery(''); // Always reset query on open
    }
  }, [isOpen]);

  const placesInRegion = timezonesByRegion[selectedRegion] || [];

  const filteredPlaces = useMemo(() => {
    if (debouncedQuery === '') return placesInRegion;
    return placesInRegion.filter(place =>
      place.toLowerCase().replace(/_/g, ' ').includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, placesInRegion]);

  return (
    <div className="space-y-3">
      {/* Region selector tabs */}
      <div className="flex flex-wrap gap-2">
        {regions.map(region => (
          <button
            key={region}
            type="button"
            onClick={() => {
              setSelectedRegion(region);
              setQuery(''); // Clear search when changing region
              onChange(''); // Clear the selected item when changing region
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
              selectedRegion === region ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {region}
          </button>
        ))}
      </div>
      
      {/* The main combobox for places */}
      <Combobox value={value} onChange={onChange}>
        {({ open }) => (
          <div className="relative">
            {/* Input container with dynamic styling */}
            <div className={`relative w-full cursor-default overflow-hidden rounded-md bg-slate-700 text-left border border-slate-600 transition-all duration-200
              ${open ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-[#00d4ff]' : ''}
            `}>
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-white bg-transparent focus:ring-0"
                onChange={(event) => setQuery(event.target.value)}
                // This displays the "city" part of the timezone for a clean UI
                displayValue={(tz: string) => (tz.split('/')[1] || tz).replace(/_/g, ' ')}
                placeholder={`Search in ${selectedRegion}...`}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                {/* Arrow with blue background and white symbol when open */}
                <div className={`p-1 rounded-full transition-colors duration-200 ${open ? 'bg-blue-600' : 'bg-transparent hover:bg-blue-600'}`}>
                  <FiChevronDown 
                    className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180 text-white' : 'text-gray-400 hover:text-white'}`}
                    aria-hidden="true" 
                  />
                </div>
              </Combobox.Button>
            </div>

            {/* Dropdown above the input */}
            {open && (
              <Combobox.Options
                static
                className="
                  absolute bottom-full mb-2 w-full
                  max-h-52 overflow-y-auto
                  rounded-md bg-slate-800 py-1 text-base shadow-lg
                  ring-1 ring-black/5 focus:outline-none sm:text-sm z-50
                  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800
                "
              >
                {filteredPlaces.length === 0 && query !== '' ? (
                  <div className="cursor-default select-none py-2 px-4 text-gray-400">
                    Nothing found.
                  </div>
                ) : (
                    filteredPlaces.map((place) => (
                    <Combobox.Option
                      key={place}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-600 text-white' : 'text-gray-200'
                        }`
                      }
                      value={place}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {(place.split('/')[1] || place).replace(/_/g, ' ')}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                              <FiCheck className="h-5 w-5" />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            )}
          </div>
        )}
      </Combobox>
    </div>
  );
};