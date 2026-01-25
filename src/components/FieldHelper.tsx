import { Box, Text } from '@chakra-ui/react';
import React from 'react';

interface FieldHelperProps {
  label: string;
  children: React.ReactNode;
}

export function FieldHelper({ label, children }: FieldHelperProps) {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
        {label}
      </Text>
      {children}
    </Box>
  );
}
