import { useState, useEffect } from "react";
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
    FormErrorMessage,
    useColorModeValue
} from "@chakra-ui/react";

const ReservationModal = ({ isOpen, onClose, onSubmit, initialEmail = "", isChangingEmail = false }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    // Color mode values
    const modalBg = useColorModeValue("white", "gray.800");
    const headerColor = useColorModeValue("gray.800", "white");
    const textColor = useColorModeValue("gray.700", "gray.300");
    const inputBg = useColorModeValue("white", "gray.700");
    const inputBorder = useColorModeValue("gray.300", "gray.600");
    const inputFocusBorder = useColorModeValue("blue.500", "blue.300");
    const placeholderColor = useColorModeValue("gray.400", "gray.500");

    // Update email when initialEmail changes or when modal opens
    useEffect(() => {
        if (isOpen) {
            setEmail(initialEmail || "");
            setError("");
        }
    }, [isOpen, initialEmail]);

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
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: "sm", md: "md" }}>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
            <ModalContent bg={modalBg} boxShadow="xl" mx={{ base: 4, md: "auto" }}>
                <ModalHeader color={headerColor} fontSize={{ base: "lg", md: "xl" }}>
                    {isChangingEmail ? "Change Email" : "Confirm Reservation"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={{ base: 4, md: 6 }}>
                    <FormControl isInvalid={Boolean(error)}>
                        <FormLabel color={textColor}>Enter your Cornell email</FormLabel>
                        <Input
                            type="email"
                            placeholder="name@cornell.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            bg={inputBg}
                            borderColor={inputBorder}
                            color={textColor}
                            _placeholder={{ color: placeholderColor }}
                            _focus={{ borderColor: inputFocusBorder }}
                            size={{ base: "md", md: "lg" }}
                            height={{ base: "40px", md: "48px" }}
                        />
                        {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </FormControl>
                </ModalBody>
                <ModalFooter pt={{ base: 2, md: 4 }}>
                    <Button variant="ghost" mr={3} onClick={onClose} size={{ base: "sm", md: "md" }}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit} size={{ base: "sm", md: "md" }}>
                        {isChangingEmail ? "Update Email" : "Reserve"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReservationModal;
