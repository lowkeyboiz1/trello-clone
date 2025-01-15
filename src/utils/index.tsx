import { TGroupMessage, TMessage } from '@/types'

export const mapOrder = (originalArray: any[], orderArray: string[], key: string) => {
  if (!originalArray || !orderArray || !key) return []

  const clonedArray = [...originalArray]
  const orderedArray = clonedArray.sort((a, b) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
  })

  return orderedArray
}

export const generatePlaceholderCard = (column: any) => {
  return {
    _id: `${column?._id}-placeholder-card`,
    boardId: column?.boardId,
    columnId: column?._id,
    FE_PlaceholderCard: true
  }
}

export const cleanMessage = (errorMessage: string) => {
  // Check if the message contains "ValidationError" and clean it
  if (errorMessage.includes('ValidationError')) {
    const cleanMsg = errorMessage.split(':')[1].trim().replace(/"/g, '')
    return cleanMsg
  }
  return errorMessage
}

export const normalizeKeyword = (keyword: string) => {
  return keyword
    .normalize('NFD')
    .toLowerCase()
    .replace(/[\u0300-\u036f\s]/g, '')
    .replace('đ', 'd')
}

export const decodeEmail = (encodedEmail: string) => {
  return decodeURIComponent(encodedEmail)
}

export function objectToFormData(obj: any) {
  const formData = new FormData()

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const valueIsFile = value instanceof File

      const isArrayData = Array.isArray(value)
      const initialValue = typeof value === 'number' ? Number(value) : ''

      if (isArrayData) {
        const isFile = value.some((item) => item instanceof File)
        if (isFile) {
          Array.prototype.forEach.call(value, (item) => {
            formData.append(key, item)
          })
        } else {
          formData.append(key, value ? JSON.stringify(value) : '')
        }
      } else {
        if (typeof value === 'object' && !isArrayData && !valueIsFile) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value || initialValue)
        }
      }
    }
  }

  return formData
}

// upercase first letter
export const uppercaseFirstLetter = (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const validateEmail = (email: string) => {
  // Check if email is a string and not empty
  if (typeof email !== 'string' || email.trim() === '') {
    return {
      isValid: false,
      message: 'Email cannot be empty'
    }
  }

  // Remove leading and trailing whitespace
  email = email.trim()

  // Check for single @ symbol
  const atSymbolCount = email.split('@').length - 1
  if (atSymbolCount !== 1) {
    return {
      isValid: false,
      message: 'Email must contain exactly one @ symbol'
    }
  }

  // Split email into local part and domain
  const [localPart, domain] = email.split('@')

  // Local part validation
  const localPartValidation = validateLocalPart(localPart)
  if (!localPartValidation.isValid) {
    return localPartValidation
  }

  // Domain validation
  const domainValidation = validateDomain(domain)
  if (!domainValidation.isValid) {
    return domainValidation
  }

  return {
    isValid: true,
    message: 'Valid email address'
  }
}

const validateLocalPart = (localPart: string) => {
  // Check local part length
  if (localPart.length === 0) {
    return {
      isValid: false,
      message: 'Local part (before @) cannot be empty'
    }
  }

  if (localPart.length > 64) {
    return {
      isValid: false,
      message: 'Local part cannot exceed 64 characters'
    }
  }

  // Check for valid characters
  const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_'
  for (let char of localPart) {
    if (!validChars.includes(char)) {
      return {
        isValid: false,
        message: `Invalid character '${char}' in local part`
      }
    }
  }

  // Ensure no consecutive dots
  if (localPart.includes('..')) {
    return {
      isValid: false,
      message: 'Local part cannot contain consecutive dots'
    }
  }

  // Ensure doesn't start or end with a dot
  if (localPart.startsWith('.')) {
    return {
      isValid: false,
      message: 'Local part cannot start with a dot'
    }
  }

  if (localPart.endsWith('.')) {
    return {
      isValid: false,
      message: 'Local part cannot end with a dot'
    }
  }

  return {
    isValid: true,
    message: 'Valid local part'
  }
}

const validateDomain = (domain: string) => {
  // Check domain length
  if (domain.length === 0) {
    return {
      isValid: false,
      message: 'Domain (after @) cannot be empty'
    }
  }

  if (domain.length > 255) {
    return {
      isValid: false,
      message: 'Domain cannot exceed 255 characters'
    }
  }

  // Split domain into parts
  const parts = domain.split('.')

  // Check for at least two parts (e.g., example.com)
  if (parts.length < 2) {
    return {
      isValid: false,
      message: 'Domain must include at least two parts (e.g., example.com)'
    }
  }

  // Validate each part of the domain
  for (let part of parts) {
    // Check individual part length
    if (part.length === 0) {
      return {
        isValid: false,
        message: 'Domain parts cannot be empty'
      }
    }

    if (part.length > 63) {
      return {
        isValid: false,
        message: 'Domain part cannot exceed 63 characters'
      }
    }

    // Check for valid characters
    const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'
    for (let char of part) {
      if (!validChars.includes(char)) {
        return {
          isValid: false,
          message: `Invalid character '${char}' in domain`
        }
      }
    }

    // Ensure doesn't start or end with a hyphen
    if (part.startsWith('-')) {
      return {
        isValid: false,
        message: 'Domain part cannot start with a hyphen'
      }
    }

    if (part.endsWith('-')) {
      return {
        isValid: false,
        message: 'Domain part cannot end with a hyphen'
      }
    }
  }

  // Check top-level domain (last part)
  const topLevelDomain = parts[parts.length - 1]
  if (topLevelDomain.length < 2) {
    return {
      isValid: false,
      message: 'Top-level domain must be at least 2 characters'
    }
  }

  return {
    isValid: true,
    message: 'Valid domain'
  }
}

export const groupMessagesBySender = (messages: TMessage[]): TGroupMessage[] => {
  if (!messages) return []
  const groupedMessages: TGroupMessage[] = []

  let currentGroup: (TMessage & { first?: boolean; last?: boolean })[] = [messages?.[0]]
  let currentUserId = messages?.[0]?.email

  for (let i = 1; i < messages.length; i++) {
    if (messages[i]?.email === currentUserId) {
      currentGroup?.push(messages?.[i])
    } else {
      if (currentGroup?.length > 0) {
        if (currentGroup.length >= 2) {
          currentGroup[0].first = true
          currentGroup[currentGroup.length - 1].last = true
        }
        groupedMessages.push({ userId: currentUserId, messages: currentGroup })
      }

      currentGroup = [messages?.[i]]
      currentUserId = messages?.[i]?.email
    }
  }

  // Xử lý nhóm cuối cùng
  if (currentGroup?.length > 0) {
    if (currentGroup.length >= 2) {
      currentGroup[0].first = true
      currentGroup[currentGroup.length - 1].last = true
    }
    groupedMessages.push({ userId: currentUserId, messages: currentGroup })
  }

  // Gỡ bỏ `last` của mọi tin nhắn ngoại trừ tin cuối cùng
  groupedMessages?.forEach((group) => {
    const lastMessageIndex = group?.messages?.length - 1
    group?.messages?.forEach((msg, index) => {
      if (index !== lastMessageIndex) {
        delete msg.last
      }
    })
  })

  return groupedMessages
}

export const isMobileWithUserAgent = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
