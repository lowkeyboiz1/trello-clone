import { Modal as ModalNextUI, ModalBody, ModalContent, ModalHeader, ModalFooter, Button, ModalProps } from '@nextui-org/react'
import { memo } from 'react'

type TModal = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  modalTitle: string | React.ReactNode
  modalFooter?: React.ReactNode | string
  children: React.ReactNode
} & Omit<ModalProps, 'children'>

const Modal = ({ isOpen, onOpenChange, modalTitle, modalFooter, children, ...props }: TModal) => {
  return (
    <ModalNextUI {...props} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>{modalTitle}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            {modalFooter && <ModalFooter>{modalFooter}</ModalFooter>}
          </>
        )}
      </ModalContent>
    </ModalNextUI>
  )
}

export default Modal
