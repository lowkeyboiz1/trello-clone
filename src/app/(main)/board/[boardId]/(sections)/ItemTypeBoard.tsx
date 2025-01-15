import { uppercaseFirstLetter } from '@/utils'

type ItemTypeBoardProps = {
  item: { type: string; description: string }
  typeBoard: string
  setTypeBoard: (type: string) => void
}

const ItemTypeBoard = ({ item, typeBoard, setTypeBoard }: ItemTypeBoardProps) => {
  return (
    <div className={`w-full rounded-lg border px-4 py-2 ${typeBoard == item.type ? 'border-white/50' : 'border-white/10'}`} onClick={() => setTypeBoard(item.type)}>
      {/* uppercase the first letter */}
      <p>{uppercaseFirstLetter(item.type)}</p>
      <p>{item.description}</p>
    </div>
  )
}

export default ItemTypeBoard
