import { ListIcon } from '@chakra-ui/react'
import { BsCheckCircle } from 'react-icons/bs'

interface CheckedOrNotProps {
  isChecked: boolean
}

export const Checked: React.FC<CheckedOrNotProps> = ({ isChecked }) =>
  isChecked && <ListIcon as={BsCheckCircle} color='brand.500' />
