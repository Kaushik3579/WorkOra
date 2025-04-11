import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Checkbox,
  Text,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';

const DOMAINS = [
  { id: 'web_dev', label: 'Web Development', description: 'Frontend, Backend, Full Stack' },
  { id: 'ui_ux', label: 'UI/UX Design', description: 'User Interface & Experience Design' },
  { id: 'mobile_dev', label: 'Mobile Development', description: 'iOS, Android, Cross-platform' },
  { id: 'data_science', label: 'Data Science', description: 'Analytics, Machine Learning, AI' },
  { id: 'devops', label: 'DevOps', description: 'CI/CD, Cloud Infrastructure, Automation' },
  { id: 'cybersecurity', label: 'Cybersecurity', description: 'Security Assessment, Penetration Testing' },
  { id: 'blockchain', label: 'Blockchain', description: 'Smart Contracts, DApps, Web3' },
  { id: 'game_dev', label: 'Game Development', description: 'Unity, Unreal Engine, Mobile Games' }
];

export default function DomainSelectionModal({ isOpen, onClose, onSubmit }) {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const toast = useToast();

  const handleDomainToggle = (domainId) => {
    setSelectedDomains(prev => {
      if (prev.includes(domainId)) {
        return prev.filter(id => id !== domainId);
      } else {
        return [...prev, domainId];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedDomains.length === 0) {
      toast({
        title: 'Please select at least one domain',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSubmit(selectedDomains);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Your Expertise</ModalHeader>
        <ModalBody>
          <Text mb={4} color="gray.600">
            Choose the domains you specialize in. You can select multiple options.
          </Text>
          <VStack align="stretch" spacing={3}>
            {DOMAINS.map(domain => (
              <Checkbox
                key={domain.id}
                isChecked={selectedDomains.includes(domain.id)}
                onChange={() => handleDomainToggle(domain.id)}
                size="lg"
              >
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{domain.label}</Text>
                  <Text fontSize="sm" color="gray.600">{domain.description}</Text>
                </VStack>
              </Checkbox>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
