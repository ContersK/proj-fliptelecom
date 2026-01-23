"use client";

import {
  Box,
  SimpleGrid,
  Text,
  HStack,
  VStack,
  Flex,
  Icon,
  Badge,
  Heading,
  Card,
  Table,
} from "@chakra-ui/react";
import {
  AlertTriangle,
  CheckCircle2,
  Headphones,
  Wallet,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

const EQUIPE_METRICS = [
  {
    name: "Rafael Alencar",
    turno: "A",
    atendimentos: 223,
    pontuacao: 271,
    maxPossivel: 325,
    percentual: 93,
  },
  {
    name: "Junior",
    turno: "A",
    atendimentos: 310,
    pontuacao: 1072,
    maxPossivel: 1125,
    percentual: 95,
  },
  {
    name: "Heitor",
    turno: "A",
    atendimentos: 454,
    pontuacao: 1723,
    maxPossivel: 1850,
    percentual: 93,
  },
  {
    name: "Lucas",
    turno: "B",
    atendimentos: 631,
    pontuacao: 2019,
    maxPossivel: 2285,
    percentual: 88,
  },
  {
    name: "Luan (Você)",
    turno: "B",
    atendimentos: 455,
    pontuacao: 1734,
    maxPossivel: 1855,
    percentual: 93,
    destaque: true,
  },
  {
    name: "Bruno",
    turno: "B",
    atendimentos: 564,
    pontuacao: 1470,
    maxPossivel: 1685,
    percentual: 87,
  },
  {
    name: "Erik",
    turno: "A",
    atendimentos: 232,
    pontuacao: 361,
    maxPossivel: 550,
    percentual: 65,
  },
];

function calcularBonus(percentual: number) {
  if (percentual >= 100) return 500;
  if (percentual >= 96) return 400;
  if (percentual >= 90) return 300;
  if (percentual >= 86) return 200;
  if (percentual >= 80) return 100;
  return 0;
}

const totalAtendimentos = EQUIPE_METRICS.reduce(
  (acc, curr) => acc + curr.atendimentos,
  0,
);
const totalBonus = EQUIPE_METRICS.reduce(
  (acc, curr) => acc + calcularBonus(curr.percentual),
  0,
);
const mediaEquipe = Math.round(
  EQUIPE_METRICS.reduce((acc, curr) => acc + curr.percentual, 0) /
    EQUIPE_METRICS.length,
);
const abaixoDaMeta = EQUIPE_METRICS.filter((t) => t.percentual < 80).length;
const acimaDe90 = EQUIPE_METRICS.filter((t) => t.percentual >= 90).length;

export default function DashboardSupport() {
  const cardBg = "white";
  const borderColor = "gray.200";

  return (
    <Box>
      <VStack gap={8} align="stretch">
        {/* CABEÇALHO PREMIUM */}
        <Box
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          p={8}
          borderRadius="2xl"
          boxShadow="xl"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-50px"
            right="-50px"
            w="200px"
            h="200px"
            bg="whiteAlpha.100"
            borderRadius="full"
          />
          <Box
            position="absolute"
            bottom="-30px"
            left="-30px"
            w="150px"
            h="150px"
            bg="whiteAlpha.100"
            borderRadius="full"
          />

          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={4}
            position="relative"
          >
            <Box>
              <HStack mb={2}>
                <Icon as={Headphones} color="white" boxSize={8} />
                <Heading size="xl" color="white">
                  Monitoramento N1
                </Heading>
              </HStack>
              <Text color="whiteAlpha.900" fontSize="md" fontWeight="medium">
                Dashboard de Qualidade & Performance
              </Text>
            </Box>
            <VStack align="end" gap={1}>
              <HStack
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                px={5}
                py={3}
                borderRadius="xl"
                border="1px solid"
                borderColor="whiteAlpha.300"
              >
                <Icon as={Calendar} color="white" boxSize={5} />
                <Box textAlign="right">
                  <Text
                    fontSize="xs"
                    color="whiteAlpha.800"
                    fontWeight="medium"
                  >
                    PERÍODO DE REFERÊNCIA
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="white">
                    Janeiro/2026
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </Flex>
        </Box>

        {/* KPI CARDS PREMIUM */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          {/* Card 1: Volumetria */}
          <Card.Root
            bg={cardBg}
            boxShadow="lg"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Box
              h="4px"
              bg="linear-gradient(90deg, #4299e1 0%, #0044CC 100%)"
            />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start" mb={4}>
                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="bold"
                    letterSpacing="wide"
                  >
                    TOTAL ATENDIMENTOS
                  </Text>
                  <Heading size="2xl" color="gray.800" mt={2}>
                    {totalAtendimentos.toLocaleString()}
                  </Heading>
                </Box>
                <Box bg="blue.50" p={3} borderRadius="xl">
                  <Icon as={Headphones} color="blue.600" boxSize={7} />
                </Box>
              </Flex>
              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.500">
                  OPA + Ligações
                </Text>
                <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                  7 técnicos
                </Badge>
              </HStack>
            </Card.Body>
          </Card.Root>

          {/* Card 2: Qualidade */}
          <Card.Root
            bg={cardBg}
            boxShadow="lg"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Box
              h="4px"
              bg={`linear-gradient(90deg, ${mediaEquipe >= 90 ? "#48bb78" : "#ed8936"} 0%, ${mediaEquipe >= 90 ? "#38a169" : "#dd6b20"} 100%)`}
            />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start" mb={4}>
                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="bold"
                    letterSpacing="wide"
                  >
                    MÉDIA DA EQUIPE
                  </Text>
                  <Heading size="2xl" color="gray.800" mt={2}>
                    {mediaEquipe}%
                  </Heading>
                </Box>
                <Box
                  bg={mediaEquipe >= 90 ? "green.50" : "orange.50"}
                  p={3}
                  borderRadius="xl"
                >
                  <Icon
                    as={TrendingUp}
                    color={mediaEquipe >= 90 ? "green.600" : "orange.600"}
                    boxSize={7}
                  />
                </Box>
              </Flex>
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs" color="gray.500">
                    Meta: 80%
                  </Text>
                  <Text fontSize="xs" color="gray.700" fontWeight="bold">
                    +{mediaEquipe - 80}%
                  </Text>
                </HStack>
                <Box
                  h="8px"
                  bg="gray.200"
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box
                    h="100%"
                    w={`${mediaEquipe}%`}
                    bg={mediaEquipe >= 90 ? "green.500" : "orange.500"}
                    borderRadius="full"
                    transition="width 0.3s"
                  />
                </Box>
              </Box>
            </Card.Body>
          </Card.Root>

          {/* Card 3: Financeiro */}
          <Card.Root
            bg={cardBg}
            boxShadow="lg"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Box
              h="4px"
              bg="linear-gradient(90deg, #9f7aea 0%, #667eea 100%)"
            />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start" mb={4}>
                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="bold"
                    letterSpacing="wide"
                  >
                    PREVISÃO DE BÔNUS
                  </Text>
                  <Heading size="2xl" color="gray.800" mt={2}>
                    R$ {totalBonus.toLocaleString()}
                  </Heading>
                </Box>
                <Box bg="purple.50" p={3} borderRadius="xl">
                  <Icon as={Wallet} color="purple.600" boxSize={7} />
                </Box>
              </Flex>
              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.500">
                  Valor total mensal
                </Text>
                <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                  {
                    EQUIPE_METRICS.filter(
                      (t) => calcularBonus(t.percentual) > 0,
                    ).length
                  }{" "}
                  elegíveis
                </Badge>
              </HStack>
            </Card.Body>
          </Card.Root>

          {/* Card 4: Performance */}
          <Card.Root
            bg={cardBg}
            boxShadow="lg"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Box
              h="4px"
              bg="linear-gradient(90deg, #48bb78 0%, #38a169 100%)"
            />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start" mb={4}>
                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="bold"
                    letterSpacing="wide"
                  >
                    ALTA PERFORMANCE
                  </Text>
                  <Heading size="2xl" color="gray.800" mt={2}>
                    {acimaDe90}
                  </Heading>
                </Box>
                <Box bg="green.50" p={3} borderRadius="xl">
                  <Icon as={Award} color="green.600" boxSize={7} />
                </Box>
              </Flex>
              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.500">
                  Acima de 90%
                </Text>
                <Badge colorScheme="green" variant="subtle" fontSize="xs">
                  {Math.round((acimaDe90 / EQUIPE_METRICS.length) * 100)}% da
                  equipe
                </Badge>
              </HStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* GRÁFICOS E ANÁLISES */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          {/* Gráfico Principal */}
          <Box
            gridColumn={{ lg: "span 2" }}
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor={borderColor}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="md" color="gray.700">
                  Ranking de Performance
                </Heading>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Aproveitamento por técnico
                </Text>
              </Box>
              <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                7 técnicos ativos
              </Badge>
            </Flex>
            <Box h="320px" w="full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...EQUIPE_METRICS].sort(
                    (a, b) => b.percentual - a.percentual,
                  )}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#718096" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    tick={{ fontSize: 12, fill: "#2D3748", fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F7FAFC" }}
                    contentStyle={{
                      backgroundColor: "#1A202C",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                    labelStyle={{ color: "#FFF", fontWeight: "bold" }}
                    formatter={(value: number | undefined) => [
                      `${value ?? 0}%`,
                      "Performance",
                    ]}
                  />
                  <ReferenceLine
                    x={80}
                    stroke="#E53E3E"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      position: "top",
                      value: "Meta 80%",
                      fill: "#E53E3E",
                      fontSize: 11,
                      fontWeight: "bold",
                    }}
                  />
                  <Bar dataKey="percentual" radius={[0, 8, 8, 0]}>
                    {EQUIPE_METRICS.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.percentual >= 90
                            ? "#38A169"
                            : entry.percentual >= 80
                              ? "#4299E1"
                              : "#E53E3E"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Painel Lateral */}
          <VStack gap={6}>
            {/* Regras de Pontuação */}
            <Box
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              border="1px solid"
              borderColor={borderColor}
              w="full"
            >
              <Heading size="sm" mb={4} color="gray.700">
                Sistema de Pontuação
              </Heading>
              <VStack align="stretch" gap={3}>
                <Flex
                  p={3}
                  bg="green.50"
                  borderRadius="lg"
                  justify="space-between"
                  align="center"
                >
                  <HStack>
                    <Badge colorScheme="green" variant="solid" fontSize="xs">
                      5★
                    </Badge>
                    <Text fontSize="sm" fontWeight="medium">
                      Excelente
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold" color="green.700">
                    +5 pts
                  </Text>
                </Flex>
                <Flex
                  p={3}
                  bg="blue.50"
                  borderRadius="lg"
                  justify="space-between"
                  align="center"
                >
                  <HStack>
                    <Badge colorScheme="blue" variant="solid" fontSize="xs">
                      4★
                    </Badge>
                    <Text fontSize="sm" fontWeight="medium">
                      Bom
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold" color="blue.700">
                    +2 pts
                  </Text>
                </Flex>
                <Flex
                  p={3}
                  bg="yellow.50"
                  borderRadius="lg"
                  justify="space-between"
                  align="center"
                >
                  <HStack>
                    <Badge colorScheme="yellow" variant="solid" fontSize="xs">
                      3★
                    </Badge>
                    <Text fontSize="sm" fontWeight="medium">
                      Regular
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold" color="yellow.700">
                    -3 pts
                  </Text>
                </Flex>
                <Flex
                  p={3}
                  bg="red.50"
                  borderRadius="lg"
                  justify="space-between"
                  align="center"
                >
                  <HStack>
                    <Badge colorScheme="red" variant="solid" fontSize="xs">
                      1★
                    </Badge>
                    <Text fontSize="sm" fontWeight="medium">
                      Crítico
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold" color="red.700">
                    -10 pts
                  </Text>
                </Flex>
              </VStack>
            </Box>

            {/* Critérios de Bônus */}
            <Box
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              w="full"
            >
              <Heading size="sm" mb={4} color="white">
                Critérios de Bônus
              </Heading>
              <VStack align="stretch" gap={2}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="whiteAlpha.900">
                    ≥ 100%
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    R$ 500
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="whiteAlpha.900">
                    ≥ 96%
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    R$ 400
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="whiteAlpha.900">
                    ≥ 90%
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    R$ 300
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="whiteAlpha.900">
                    ≥ 86%
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    R$ 200
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="whiteAlpha.900">
                    ≥ 80%
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    R$ 100
                  </Text>
                </HStack>
                <Box h="1px" bg="whiteAlpha.300" my={2} />
                <Text fontSize="xs" color="whiteAlpha.800">
                  *Mínimo 80% + pontuação acima da média do turno
                </Text>
              </VStack>
            </Box>
          </VStack>
        </SimpleGrid>

        {/* TABELA DETALHADA */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid"
          borderColor={borderColor}
          overflowX="auto"
        >
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading size="md" color="gray.700">
                Detalhamento Individual
              </Heading>
              <Text fontSize="sm" color="gray.500" mt={1}>
                Cálculo completo de performance e bonificação
              </Text>
            </Box>
            <HStack gap={2}>
              <Badge colorScheme="green" variant="subtle">
                {EQUIPE_METRICS.filter((t) => t.percentual >= 80).length} aptos
              </Badge>
              {abaixoDaMeta > 0 && (
                <Badge colorScheme="red" variant="subtle">
                  {abaixoDaMeta} em atenção
                </Badge>
              )}
            </HStack>
          </Flex>

          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader fontWeight="bold" color="gray.700">
                  Técnico
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="center"
                  fontWeight="bold"
                  color="gray.700"
                >
                  Turno
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="center"
                  fontWeight="bold"
                  color="gray.700"
                >
                  Atendimentos
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="center"
                  fontWeight="bold"
                  color="gray.700"
                >
                  Pontuação
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="center"
                  fontWeight="bold"
                  color="gray.700"
                >
                  Máx. Possível
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="center"
                  fontWeight="bold"
                  color="gray.700"
                >
                  Performance
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="center"
                  fontWeight="bold"
                  color="gray.700"
                >
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="end"
                  fontWeight="bold"
                  color="gray.700"
                >
                  Bônus
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {EQUIPE_METRICS.sort((a, b) => b.percentual - a.percentual).map(
                (row, index) => {
                  const bonus = calcularBonus(row.percentual);
                  const isEligible = row.percentual >= 80;

                  return (
                    <Table.Row
                      key={index}
                      bg={row.destaque ? "blue.50" : "white"}
                      _hover={{ bg: row.destaque ? "blue.100" : "gray.50" }}
                      transition="all 0.2s"
                    >
                      <Table.Cell>
                        <HStack>
                          <Text fontWeight={row.destaque ? "bold" : "medium"}>
                            {row.name}
                          </Text>
                          {row.destaque && (
                            <Badge
                              colorScheme="blue"
                              variant="solid"
                              fontSize="xs"
                            >
                              Você
                            </Badge>
                          )}
                        </HStack>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Badge
                          colorScheme={row.turno === "A" ? "purple" : "cyan"}
                          variant="subtle"
                        >
                          {row.turno}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell textAlign="center" fontWeight="medium">
                        {row.atendimentos}
                      </Table.Cell>
                      <Table.Cell
                        textAlign="center"
                        fontWeight="medium"
                        color="blue.600"
                      >
                        {row.pontuacao}
                      </Table.Cell>
                      <Table.Cell
                        textAlign="center"
                        color="gray.500"
                        fontSize="sm"
                      >
                        {row.maxPossivel}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <VStack gap={1}>
                          <Badge
                            colorScheme={
                              row.percentual >= 90
                                ? "green"
                                : row.percentual >= 80
                                  ? "blue"
                                  : "red"
                            }
                            variant="solid"
                            fontSize="sm"
                            px={3}
                            py={1}
                          >
                            {row.percentual}%
                          </Badge>
                          <Box
                            w="60px"
                            h="4px"
                            bg="gray.200"
                            borderRadius="full"
                            overflow="hidden"
                          >
                            <Box
                              h="100%"
                              w={`${row.percentual}%`}
                              bg={
                                row.percentual >= 90
                                  ? "green.500"
                                  : row.percentual >= 80
                                    ? "blue.500"
                                    : "red.500"
                              }
                              borderRadius="full"
                              transition="width 0.3s"
                            />
                          </Box>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {isEligible ? (
                          <Box
                            display="inline-flex"
                            bg="green.50"
                            p={2}
                            borderRadius="lg"
                          >
                            <Icon
                              as={CheckCircle2}
                              color="green.600"
                              boxSize={5}
                            />
                          </Box>
                        ) : (
                          <Box
                            display="inline-flex"
                            bg="red.50"
                            p={2}
                            borderRadius="lg"
                          >
                            <Icon
                              as={AlertTriangle}
                              color="red.600"
                              boxSize={5}
                            />
                          </Box>
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign="end">
                        <Text
                          fontWeight="bold"
                          fontSize="md"
                          color={bonus > 0 ? "green.600" : "gray.400"}
                        >
                          R$ {bonus},00
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  );
                },
              )}
            </Table.Body>
          </Table.Root>

          {/* Rodapé da Tabela */}
          <Flex
            mt={4}
            pt={4}
            borderTop="2px solid"
            borderColor="gray.200"
            justify="space-between"
            align="center"
            bg="gray.50"
            p={4}
            borderRadius="lg"
          >
            <HStack gap={6}>
              <VStack align="start" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">
                  TOTAL GERAL
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  {totalAtendimentos} atendimentos
                </Text>
              </VStack>
              <VStack align="start" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">
                  MÉDIA EQUIPE
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  {mediaEquipe}%
                </Text>
              </VStack>
            </HStack>
            <VStack align="end" gap={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="bold">
                BÔNUS TOTAL
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                R$ {totalBonus.toLocaleString()},00
              </Text>
            </VStack>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
}
