import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { normalizeKeyword } from '@/utils'
import { Input } from '@nextui-org/react'
import { Add, SearchNormal1 } from 'iconsax-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LoadingSearch } from '../Icons'

const InputSearch = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { userInfo } = useStoreUser()
  const [searchValue, setSearchValue] = useState('')
  const [onSearching, setOnSearching] = useState(false)
  const [debouncedValue, setDebouncedValue] = useState(searchValue)
  const _handleClear = () => {
    setSearchValue('')
    inputRef?.current?.focus()
  }

  const _handleSearching = useCallback(async () => {
    if (!debouncedValue.trim()) {
      setOnSearching(false)
      return
    }

    setOnSearching(true)
    const payload = {
      keyword: normalizeKeyword(debouncedValue.trim()),
      email: userInfo?.email,
    }
    try {
      const { data } = await instance.post(`/v1/boards/search-board`, payload)
      console.log(data)
    } catch (error) {
      console.log(error)
    } finally {
      setOnSearching(false)
    }
  }, [debouncedValue, userInfo?.email])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue])

  useEffect(() => {
    _handleSearching()
  }, [debouncedValue])

  const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <Input
      ref={inputRef}
      placeholder='Search'
      autoComplete='off'
      variant='bordered'
      startContent={<SearchNormal1 size={24} className='text-primary' />}
      endContent={
        onSearching && !!searchValue.length ? (
          <LoadingSearch className='absolute right-1.5 size-5 animate-spin text-white' />
        ) : (
          !!searchValue.length && <Add size={24} className='absolute right-1 rotate-45 cursor-pointer text-primary' onClick={_handleClear} />
        )
      }
      classNames={{
        inputWrapper: 'max-h-10 border-primary data-[hover=true]:border-primary group-data-[focus=true]:border-primary',
        input: 'text-primary placeholder:text-primary data-[has-start-content=true]:pr-4',
      }}
      className='min-w-[120px]'
      value={searchValue}
      onChange={_handleChange}
    />
  )
}

export default InputSearch
