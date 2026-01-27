import { Box, Text } from '@chakra-ui/react';
import React from 'react';

interface FieldHelperProps {
  label: string;
  children: React.ReactNode;
  labelColor?: string;
}

export function FieldHelper({ label, children, labelColor }: FieldHelperProps) {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={2} color={labelColor || 'gray.700'}>
        {label}
      </Text>
      {children}
    </Box>
  );
}
