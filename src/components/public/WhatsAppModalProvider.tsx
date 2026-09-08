"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { WhatsAppEnquiryModal } from "./WhatsAppEnquiryModal";

export interface WhatsAppModalOptions {
  propertyId?: string;
}

interface WhatsAppModalContextValue {
  openWhatsAppModal: (options?: WhatsAppModalOptions) => void;
}

const WhatsAppModalContext = createContext<WhatsAppModalContextValue>({
  openWhatsAppModal: () => {},
});

export function useWhatsAppModal() {
  return useContext(WhatsAppModalContext);
}

export function WhatsAppModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [options, setOptions] = useState<WhatsAppModalOptions | null>(null);

  const openWhatsAppModal = useCallback(
    (opts: WhatsAppModalOptions = {}) => setOptions(opts),
    []
  );
  const closeWhatsAppModal = useCallback(() => setOptions(null), []);

  const value = useMemo(
    () => ({ openWhatsAppModal }),
    [openWhatsAppModal]
  );

  return (
    <WhatsAppModalContext.Provider value={value}>
      {children}
      <WhatsAppEnquiryModal
        open={options !== null}
        onClose={closeWhatsAppModal}
        defaultPropertyId={options?.propertyId}
      />
    </WhatsAppModalContext.Provider>
  );
}