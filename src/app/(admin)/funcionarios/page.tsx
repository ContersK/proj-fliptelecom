"use client";

import React, { useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  chakra,
  SimpleGrid,
  Table,
  Text,
  VStack,
  Badge,
  Card,
  InputGroup,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogBackdrop,
  Stack,
} from "@chakra-ui/react";
import { UserPlus, Search, Users, Edit, Trash2 } from "lucide-react";
import { FieldHelper } from "@/components/FieldHelper";

const FUNCIONARIOS_DATA = [
  {
    id: 1,
    nome: "Rafael Alencar",
    setor: "Suporte N1",
    turno: "A",
    ativo: true,
    dataAdmissao: "15/03/2024",
    mediaPerformance: 93,
    ultimaAvaliacao: "Janeiro/2026",
  },
  {
    id: 2,
    nome: "Junior Silva",
    setor: "Suporte N1",
    turno: "A",
    ativo: true,
    dataAdmissao: "20/02/2024",
    mediaPerformance: 95,
    ultimaAvaliacao: "Janeiro/2026",
  },
  {
    id: 3,
    nome: "Heitor Costa",
    setor: "Suporte N1",
    turno: "A",
    ativo: true,
    dataAdmissao: "10/01/2024",
    mediaPerformance: 93,
    ultimaAvaliacao: "Janeiro/2026",
  },
];

type Funcionario = {
  id: number;
  nome: string;
  setor: string;
  turno: string;
  ativo: boolean;
  dataAdmissao: string;
  mediaPerformance: number;
  ultimaAvaliacao: string;
};

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] =
    useState<Funcionario[]>(FUNCIONARIOS_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [setorFilter, setSetorFilter] = useState("todos");

  // Estados dos modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<Funcionario | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    nome: "",
    setor: "Suporte N1",
    turno: "A",
    ativo: true,
    dataAdmissao: "",
    mediaPerformance: 0,
    ultimaAvaliacao: "",
  });

  const filteredData = funcionarios.filter((item) => {
    const matchSearch = item.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "todos" ||
      (statusFilter === "ativo" && item.ativo) ||
      (statusFilter === "inativo" && !item.ativo);
    const matchSetor = setorFilter === "todos" || item.setor === setorFilter;
    return matchSearch && matchStatus && matchSetor;
  });

  const totalFuncionarios = funcionarios.length;

  // Funções do CRUD
  const handleAddFuncionario = () => {
    const newFuncionario: Funcionario = {
      id: Math.max(...funcionarios.map((f) => f.id)) + 1,
      ...formData,
    };
    setFuncionarios([...funcionarios, newFuncionario]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditFuncionario = () => {
    if (!selectedFuncionario) return;
    setFuncionarios(
      funcionarios.map((f) =>
        f.id === selectedFuncionario.id ? { ...f, ...formData } : f,
      ),
    );
    setShowEditModal(false);
    setSelectedFuncionario(null);
    resetForm();
  };

  const handleDeleteFuncionario = () => {
    if (!selectedFuncionario) return;
    setFuncionarios(
      funcionarios.filter((f) => f.id !== selectedFuncionario.id),
    );
    setShowDeleteModal(false);
    setSelectedFuncionario(null);
  };

  const openEditModal = (func: Funcionario) => {
    setSelectedFuncionario(func);
    setFormData({
      nome: func.nome,
      setor: func.setor,
      turno: func.turno,
      ativo: func.ativo,
      dataAdmissao: func.dataAdmissao,
      mediaPerformance: func.mediaPerformance,
      ultimaAvaliacao: func.ultimaAvaliacao,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (func: Funcionario) => {
    setSelectedFuncionario(func);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      setor: "Suporte N1",
      turno: "A",
      ativo: true,
      dataAdmissao: "",
      mediaPerformance: 0,
      ultimaAvaliacao: "",
    });
  };

  return (
    <Box>
      <VStack gap={8} align="stretch">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" color="gray.700">
              Gestão de Funcionários
            </Heading>
            <Text color="gray.500" fontSize="sm" mt={1}>
              Controle completo da equipe
            </Text>
          </Box>
          <Button
            colorScheme="blue"
            size="md"
            onClick={() => setShowAddModal(true)}
          >
            <Icon as={UserPlus} boxSize={4} mr={2} />
            Novo Funcionário
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          <Card.Root
            bg="white"
            boxShadow="lg"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Box
              h="4px"
              bg="linear-gradient(90deg, #4299e1 0%, #3182ce 100%)"
            />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    TOTAL
                  </Text>
                  <Heading size="2xl" color="gray.800" mt={2}>
                    {totalFuncionarios}
                  </Heading>
                </Box>
                <Box bg="blue.50" p={3} borderRadius="xl">
                  <Icon as={Users} color="blue.600" boxSize={7} />
                </Box>
              </Flex>
              <Text fontSize="xs" color="gray.500" mt={3}>
                Funcionários cadastrados
              </Text>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Filtros */}
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <HStack gap={4} wrap="wrap">
            <Box flex="1" minW="250px">
              <InputGroup
                startElement={<Icon as={Search} color="gray.400" ml={3} />}
              >
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="lg"
                  bg="gray.50"
                />
              </InputGroup>
            </Box>
            <chakra.select
              value={statusFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value)
              }
              w="200px"
              bg="gray.50"
              aria-label="Filtrar por status"
            >
              <option value="todos">Todos Status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </chakra.select>
            <chakra.select
              value={setorFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSetorFilter(e.target.value)
              }
              w="200px"
              bg="gray.50"
              aria-label="Filtrar por setor"
            >
              <option value="todos">Todos Setores</option>
              <option value="Suporte N1">Suporte N1</option>
              <option value="Suporte N2">Suporte N2</option>
              <option value="Vendas">Vendas</option>
            </chakra.select>
          </HStack>
        </Box>

        {/* Tabela (simplificada) */}
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Box p={6} borderBottom="1px solid" borderColor="gray.200">
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="md" color="gray.700">
                  Lista de Funcionários
                </Heading>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {filteredData.length} funcionários encontrados
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row bg="gray.50">
                  <Table.ColumnHeader fontWeight="bold">
                    Nome
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Setor/Turno
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Admissão
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Performance
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Última Avaliação
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Status
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Ações
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredData.map((func) => (
                  <Table.Row
                    key={func.id}
                    _hover={{ bg: "gray.50" }}
                    transition="all 0.2s"
                  >
                    <Table.Cell>
                      <Text fontWeight="medium">{func.nome}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <VStack gap={1}>
                        <Text fontSize="sm">{func.setor}</Text>
                        <Badge
                          colorScheme={func.turno === "A" ? "purple" : "cyan"}
                          variant="subtle"
                          fontSize="xs"
                        >
                          Turno {func.turno}
                        </Badge>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text fontSize="sm">{func.dataAdmissao}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <VStack gap={1}>
                        <Badge
                          colorScheme={
                            func.mediaPerformance >= 90
                              ? "green"
                              : func.mediaPerformance >= 80
                                ? "blue"
                                : "red"
                          }
                          variant="solid"
                          fontSize="sm"
                          px={3}
                          py={1}
                        >
                          {func.mediaPerformance}%
                        </Badge>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text fontSize="sm">{func.ultimaAvaliacao}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Badge
                        colorScheme={func.ativo ? "green" : "red"}
                        variant="subtle"
                        px={3}
                        py={1}
                      >
                        {func.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <HStack justify="center" gap={2}>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => openEditModal(func)}
                        >
                          <Icon as={Edit} boxSize={4} mr={2} />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => openDeleteModal(func)}
                        >
                          <Icon as={Trash2} boxSize={4} mr={2} />
                          Remover
                        </Button>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      </VStack>

      {/* Modal Adicionar Funcionário */}
      <DialogRoot
        open={showAddModal}
        onOpenChange={(e) => setShowAddModal(e.open)}
      >
        <DialogBackdrop />
        <DialogContent maxW="2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <Stack gap={4}>
              <FieldHelper label="Nome Completo">
                <Input
                  value={formData.nome}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Digite o nome completo"
                />
              </FieldHelper>

              <SimpleGrid columns={2} gap={4}>
                <FieldHelper label="Setor">
                  <chakra.select
                    value={formData.setor}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFormData({ ...formData, setor: e.target.value })
                    }
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                  >
                    <option value="Suporte N1">Suporte N1</option>
                    <option value="Suporte N2">Suporte N2</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Administrativo">Administrativo</option>
                  </chakra.select>
                </FieldHelper>

                <FieldHelper label="Turno">
                  <chakra.select
                    value={formData.turno}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFormData({ ...formData, turno: e.target.value })
                    }
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                  >
                    <option value="A">Turno A</option>
                    <option value="B">Turno B</option>
                    <option value="C">Turno C</option>
                  </chakra.select>
                </FieldHelper>
              </SimpleGrid>

              <SimpleGrid columns={2} gap={4}>
                <FieldHelper label="Data de Admissão">
                  <Input
                    type="date"
                    value={formData.dataAdmissao}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, dataAdmissao: e.target.value })
                    }
                  />
                </FieldHelper>

                <FieldHelper label="Status">
                  <chakra.select
                    value={formData.ativo ? "true" : "false"}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFormData({
                        ...formData,
                        ativo: e.target.value === "true",
                      })
                    }
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </chakra.select>
                </FieldHelper>
              </SimpleGrid>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleAddFuncionario}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      {/* Modal Editar Funcionário */}
      <DialogRoot
        open={showEditModal}
        onOpenChange={(e) => setShowEditModal(e.open)}
      >
        <DialogBackdrop />
        <DialogContent maxW="2xl">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <Stack gap={4}>
              <FieldHelper label="Nome Completo">
                <Input
                  value={formData.nome}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Digite o nome completo"
                />
              </FieldHelper>

              <SimpleGrid columns={2} gap={4}>
                <FieldHelper label="Setor">
                  <chakra.select
                    value={formData.setor}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFormData({ ...formData, setor: e.target.value })
                    }
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                  >
                    <option value="Suporte N1">Suporte N1</option>
                    <option value="Suporte N2">Suporte N2</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Administrativo">Administrativo</option>
                  </chakra.select>
                </FieldHelper>

                <FieldHelper label="Turno">
                  <chakra.select
                    value={formData.turno}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFormData({ ...formData, turno: e.target.value })
                    }
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                  >
                    <option value="A">Turno A</option>
                    <option value="B">Turno B</option>
                    <option value="C">Turno C</option>
                  </chakra.select>
                </FieldHelper>
              </SimpleGrid>

              <SimpleGrid columns={2} gap={4}>
                <FieldHelper label="Data de Admissão">
                  <Input
                    type="date"
                    value={formData.dataAdmissao}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, dataAdmissao: e.target.value })
                    }
                  />
                </FieldHelper>

                <FieldHelper label="Status">
                  <chakra.select
                    value={formData.ativo ? "true" : "false"}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFormData({
                        ...formData,
                        ativo: e.target.value === "true",
                      })
                    }
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </chakra.select>
                </FieldHelper>
              </SimpleGrid>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleEditFuncionario}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      {/* Modal Confirmar Exclusão */}
      <DialogRoot
        open={showDeleteModal}
        onOpenChange={(e) => setShowDeleteModal(e.open)}
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <Text>
              Tem certeza que deseja remover o funcionário{" "}
              <strong>{selectedFuncionario?.nome}</strong>? Esta ação não pode
              ser desfeita.
            </Text>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDeleteFuncionario}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
