"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
  Box,
} from "@chakra-ui/react"
import { Text } from "@chakra-ui/react";
import { CheckIcon } from "lucide-react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root key={toast.id} width={{ md: "sm" }} bg={"black"} display="flex" alignItems={"center"}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : toast.type === "success" ? (
              <Box
                boxSize="4"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
                bg="white"
              >
                <CheckIcon size={14} color="black" />
              </Box>
            ) : (
              <Toast.Indicator />
            )}

            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
               {toast.description && (
                <Text color="#FFFFFF" opacity={1} fontSize="sm" lineHeight="short">
                  {toast.description}
                </Text>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
