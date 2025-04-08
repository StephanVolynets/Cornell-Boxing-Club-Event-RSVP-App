import { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage
} from "@chakra-ui/react";

const ReservationModal = ({ isOpen, onClose, onSubmit }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        // Validate Cornell email
        if (!email.trim().toLowerCase().endsWith("@cornell.edu")) {
            setError("Please use your Cornell email.");
            return;
        }
        onSubmit(email);
        setEmail("");
        setError("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Reservation</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={Boolean(error)}>
                        <FormLabel>Enter your Cornell email</FormLabel>
                        <Input
                            type="email"
                            placeholder="name@cornell.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Reserve
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReservationModal;
