import { Button } from '@nextui-org/react'
import Modal from '../Modal'

type ModalDeleteCardProps = {
  isOpen: boolean
  onOpenChange: () => void
  onDeletingCard: boolean
  handleDeleteCard: () => void
}

const ModalDeleteCard = ({ isOpen, onOpenChange, onDeletingCard, handleDeleteCard }: ModalDeleteCardProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      modalTitle='Delete Card'
      modalFooter={
        <div className='flex items-center gap-2'>
          <Button isLoading={onDeletingCard} variant='light' color='danger' onClick={() => handleDeleteCard()} className='px-6 py-3'>
            Delete
          </Button>
          <Button onClick={onOpenChange} className='bg-colorBoardContent px-6 py-3 text-white'>
            Cancel
          </Button>
        </div>
      }
    >
      Are you sure you want to delete this card?
    </Modal>
  )
}

export default ModalDeleteCard
