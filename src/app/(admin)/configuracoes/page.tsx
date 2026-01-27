'use client';

import React, { useState, useEffect, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  VStack,
  Card,
  Stack,
  Table,
  HStack,
  Badge,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import {
  Settings,
  Save,
  Bell,
  DollarSign,
  Shield,
  Database,
  UserPlus,
  Users,
  Trash2,
  Edit2,
  AlertTriangle,
  Send,
  MessageSquare,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { FieldHelper } from '@/components/FieldHelper';
import { SwitchField } from '@/components/SwitchField';
import { useFlipTheme } from '@/hooks/useFlipTheme';

type Supervisor = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type Notificacao = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  createdBy?: { name: string } | null;
  target?: { name: string } | null;
};

export default function ConfiguracoesPage() {
  // Estados para configurações gerais
  const [nomeEmpresa, setNomeEmpresa] = useState('FlipTelecom');
  const [emailSuporte, setEmailSuporte] = useState('suporte@fliptelecom.com');
  const [telefone, setTelefone] = useState('(11) 99999-9999');

  // Estados para configurações de comissões
  const [valorComissao, setValorComissao] = useState('300');
  const [metaMinima, setMetaMinima] = useState('90');
  const [diaFechamento, setDiaFechamento] = useState('5');

  // Estados para notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [performanceAlerts, setPerformanceAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  // Estados para sistema
  const [autoBackup, setAutoBackup] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // Estados para criação de usuários
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('SUPERVISOR');
  const [creatingUser, setCreatingUser] = useState(false);

  // Estados para lista de supervisores
  const [supervisores, setSupervisores] = useState<Supervisor[]>([]);
  const [loadingSupervisores, setLoadingSupervisores] = useState(false);

  // Estados para edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Estados para diálogos de confirmação
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [limparDadosOpen, setLimparDadosOpen] = useState(false);
  const [resetarSistemaOpen, setResetarSistemaOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Estados para notificações do sistema
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('info');
  const [notifTarget, setNotifTarget] = useState('all');
  const [sendingNotif, setSendingNotif] = useState(false);

  // Carregar notificações
  const fetchNotificacoes = async () => {
    setLoadingNotificacoes(true);
    try {
      const res = await fetch('/api/notificacoes');
      if (res.ok) {
        const data = await res.json();
        setNotificacoes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoadingNotificacoes(false);
    }
  };

  // Carregar supervisores
  const fetchSupervisores = async () => {
    setLoadingSupervisores(true);
    try {
      const res = await fetch('/api/configuracoes');
      if (res.ok) {
        const data = await res.json();
        setSupervisores(data);
      }
    } catch (error) {
      console.error('Erro ao carregar supervisores:', error);
    } finally {
      setLoadingSupervisores(false);
    }
  };

  useEffect(() => {
    fetchSupervisores();
    fetchNotificacoes();
  }, []);

  const handleSendNotification = async () => {
    if (!notifTitle || !notifMessage) {
      alert('Preencha título e mensagem da notificação.');
      return;
    }

    setSendingNotif(true);
    try {
      const res = await fetch('/api/notificacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          type: notifType,
          targetId: notifTarget === 'all' ? null : notifTarget,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Erro ao enviar');
      }

      alert('Notificação enviada com sucesso!');
      setNotifTitle('');
      setNotifMessage('');
      setNotifType('info');
      setNotifTarget('all');
      fetchNotificacoes();
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar notificação');
    } finally {
      setSendingNotif(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notificacoes?id=${id}`, { method: 'DELETE' });
      fetchNotificacoes();
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const handleClearAllNotifications = async () => {
    if (!confirm('Tem certeza que deseja deletar todas as notificações?')) return;
    try {
      await fetch('/api/notificacoes?deleteAll=true', { method: 'DELETE' });
      fetchNotificacoes();
      alert('Todas notificações foram deletadas.');
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  };

  const handleSaveSettings = () => {
    alert('Configurações salvas com sucesso!');
  };

  const handleCreateUser = async () => {
    if (!userName || !userEmail || !userPassword) {
      alert('Preencha nome, email e senha.');
      return;
    }

    setCreatingUser(true);
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          password: userPassword,
          role: userRole,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Erro ao criar usuário');
      }

      alert('Usuário criado com sucesso!');
      setUserName('');
      setUserEmail('');
      setUserPassword('');
      setUserRole('SUPERVISOR');
      fetchSupervisores();
    } catch (error) {
      console.error(error);
      alert('Erro ao criar usuário');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleStartEdit = (supervisor: Supervisor) => {
    setEditingId(supervisor.id);
    setEditName(supervisor.name);
    setEditEmail(supervisor.email);
    setEditPassword('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
    setEditPassword('');
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const res = await fetch('/api/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: editName,
          email: editEmail,
          password: editPassword || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Erro ao atualizar');
      }

      alert('Supervisor atualizado com sucesso!');
      handleCancelEdit();
      fetchSupervisores();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar supervisor');
    }
  };

  const handleDeleteSupervisor = async () => {
    if (!deleteTargetId) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/configuracoes?id=${deleteTargetId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Erro ao deletar');
      }

      alert('Supervisor deletado com sucesso!');
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      fetchSupervisores();
    } catch (error) {
      console.error(error);
      alert('Erro ao deletar supervisor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLimparDados = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/configuracoes?action=limpar-dados', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Erro ao limpar dados');
      }

      alert(
        'Dados limpos com sucesso! Supervisores e funcionários removidos. Administradores mantidos.',
      );
      setLimparDadosOpen(false);
      fetchSupervisores();
    } catch (error) {
      console.error(error);
      alert('Erro ao limpar dados');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetarSistema = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/configuracoes?action=resetar-sistema', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Erro ao resetar sistema');
      }

      alert('Sistema resetado com sucesso! Apenas administradores foram mantidos.');
      setResetarSistemaOpen(false);
      fetchSupervisores();
    } catch (error) {
      console.error(error);
      alert('Erro ao resetar sistema');
    } finally {
      setActionLoading(false);
    }
  };

  const theme = useFlipTheme();

  return (
    <Box>
      <VStack gap={8} align="stretch">
        {/* Cabeçalho */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" color={theme.textPrimary}>
              Configurações do Sistema
            </Heading>
            <Text color={theme.textSecondary} fontSize="sm" mt={1}>
              Gerencie as configurações da plataforma
            </Text>
          </Box>
          <Button colorScheme="blue" size="md" onClick={handleSaveSettings}>
            <Icon as={Save} boxSize={4} mr={2} />
            Salvar Alterações
          </Button>
        </Flex>

        {/* Lista de Supervisores */}
        <Card.Root
          bg={theme.bgCard}
          boxShadow="lg"
          borderRadius="xl"
          border="1px solid"
          borderColor={theme.borderColor}
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box
                bg={theme.colorMode === 'dark' ? 'indigo.900' : 'indigo.50'}
                p={3}
                borderRadius="lg"
              >
                <Icon
                  as={Users}
                  color={theme.colorMode === 'dark' ? 'indigo.300' : 'indigo.600'}
                  boxSize={6}
                />
              </Box>
              <Box>
                <Heading size="md" color={theme.textPrimary}>
                  Supervisores do Sistema
                </Heading>
                <Text fontSize="sm" color={theme.textSecondary}>
                  Gerencie os supervisores cadastrados
                </Text>
              </Box>
              <Badge ml="auto" colorPalette="blue" variant="subtle" px={3} py={1}>
                {supervisores.length} supervisor(es)
              </Badge>
            </Flex>

            {loadingSupervisores ? (
              <Text color={theme.textMuted} textAlign="center" py={8}>
                Carregando...
              </Text>
            ) : supervisores.length === 0 ? (
              <Text color={theme.textMuted} textAlign="center" py={8}>
                Nenhum supervisor cadastrado
              </Text>
            ) : (
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row bg={theme.bgSecondary}>
                    <Table.ColumnHeader color={theme.textSecondary}>Nome</Table.ColumnHeader>
                    <Table.ColumnHeader color={theme.textSecondary}>Email</Table.ColumnHeader>
                    <Table.ColumnHeader color={theme.textSecondary}>
                      Cadastrado em
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end" color={theme.textSecondary}>
                      Ações
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {supervisores.map((supervisor) => (
                    <Table.Row key={supervisor.id} _hover={{ bg: theme.bgHover }}>
                      <Table.Cell>
                        {editingId === supervisor.id ? (
                          <Input
                            size="sm"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            bg={theme.bgInput}
                            color={theme.textPrimary}
                          />
                        ) : (
                          <Text fontWeight="medium" color={theme.textPrimary}>
                            {supervisor.name}
                          </Text>
                        )}
                      </Table.Cell>
                      <Table.Cell color={theme.textPrimary}>
                        {editingId === supervisor.id ? (
                          <Input
                            size="sm"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            bg={theme.bgInput}
                            color={theme.textPrimary}
                          />
                        ) : (
                          supervisor.email
                        )}
                      </Table.Cell>
                      <Table.Cell color={theme.textMuted} fontSize="sm">
                        {new Date(supervisor.createdAt).toLocaleDateString('pt-BR')}
                      </Table.Cell>
                      <Table.Cell>
                        <HStack justify="end" gap={2}>
                          {editingId === supervisor.id ? (
                            <>
                              <Input
                                size="sm"
                                placeholder="Nova senha (opcional)"
                                type="password"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                w="140px"
                                bg={theme.bgInput}
                                color={theme.textPrimary}
                              />
                              <Button size="xs" colorScheme="green" onClick={handleSaveEdit}>
                                Salvar
                              </Button>
                              <Button size="xs" variant="ghost" onClick={handleCancelEdit}>
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => handleStartEdit(supervisor)}
                              >
                                <Edit2 size={14} />
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => {
                                  setDeleteTargetId(supervisor.id);
                                  setDeleteConfirmOpen(true);
                                }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </>
                          )}
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Card.Body>
        </Card.Root>

        {/* Enviar Notificações */}
        <Card.Root
          bg={theme.bgCard}
          boxShadow="lg"
          borderRadius="xl"
          border="1px solid"
          borderColor={theme.borderColor}
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box
                bg={theme.colorMode === 'dark' ? 'purple.900' : 'purple.50'}
                p={3}
                borderRadius="lg"
              >
                <Icon
                  as={Send}
                  color={theme.colorMode === 'dark' ? 'purple.300' : 'purple.600'}
                  boxSize={6}
                />
              </Box>
              <Box>
                <Heading size="md" color={theme.textPrimary}>
                  Enviar Notificação
                </Heading>
                <Text fontSize="sm" color={theme.textSecondary}>
                  Envie avisos para supervisores do sistema
                </Text>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <FieldHelper label="Título da Notificação" labelColor={theme.textSecondary}>
                <Input
                  value={notifTitle}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNotifTitle(e.target.value)}
                  placeholder="Ex: Fechamento de Comissão"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>

              <FieldHelper label="Tipo" labelColor={theme.textSecondary}>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.borderColor}`,
                    fontSize: '14px',
                    backgroundColor: theme.bgInput,
                    color: theme.textPrimary,
                  }}
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value)}
                >
                  <option value="info">ℹ️ Informação</option>
                  <option value="warning">⚠️ Aviso</option>
                  <option value="success">✅ Sucesso</option>
                  <option value="error">❌ Erro/Urgente</option>
                </select>
              </FieldHelper>

              <FieldHelper label="Mensagem" labelColor={theme.textSecondary}>
                <Input
                  value={notifMessage}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNotifMessage(e.target.value)}
                  placeholder="Digite a mensagem da notificação..."
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>

              <FieldHelper label="Destinatário" labelColor={theme.textSecondary}>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.borderColor}`,
                    fontSize: '14px',
                    backgroundColor: theme.bgInput,
                    color: theme.textPrimary,
                  }}
                  value={notifTarget}
                  onChange={(e) => setNotifTarget(e.target.value)}
                >
                  <option value="all">📢 Todos os Supervisores</option>
                  {supervisores.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      👤 {sup.name}
                    </option>
                  ))}
                </select>
              </FieldHelper>
            </SimpleGrid>

            <Flex justify="flex-end" mt={6}>
              <Button colorScheme="purple" onClick={handleSendNotification} loading={sendingNotif}>
                <Send size={16} style={{ marginRight: 8 }} />
                Enviar Notificação
              </Button>
            </Flex>
          </Card.Body>
        </Card.Root>

        {/* Histórico de Notificações */}
        <Card.Root
          bg={theme.bgCard}
          boxShadow="lg"
          borderRadius="xl"
          border="1px solid"
          borderColor={theme.borderColor}
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box
                bg={theme.colorMode === 'dark' ? 'orange.900' : 'orange.50'}
                p={3}
                borderRadius="lg"
              >
                <Icon
                  as={MessageSquare}
                  color={theme.colorMode === 'dark' ? 'orange.300' : 'orange.600'}
                  boxSize={6}
                />
              </Box>
              <Box flex={1}>
                <Heading size="md" color={theme.textPrimary}>
                  Histórico de Notificações
                </Heading>
                <Text fontSize="sm" color={theme.textSecondary}>
                  Todas as notificações enviadas
                </Text>
              </Box>
              <Badge colorPalette="orange" variant="subtle" px={3} py={1}>
                {notificacoes.length} notificação(ões)
              </Badge>
              {notificacoes.length > 0 && (
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="outline"
                  onClick={handleClearAllNotifications}
                >
                  Limpar Tudo
                </Button>
              )}
            </Flex>

            {loadingNotificacoes ? (
              <Text color={theme.textMuted} textAlign="center" py={8}>
                Carregando...
              </Text>
            ) : notificacoes.length === 0 ? (
              <Text color={theme.textMuted} textAlign="center" py={8}>
                Nenhuma notificação enviada
              </Text>
            ) : (
              <VStack align="stretch" gap={3} maxH="400px" overflowY="auto">
                {notificacoes.map((notif) => (
                  <Flex
                    key={notif.id}
                    p={4}
                    bg={
                      notif.read
                        ? theme.bgSecondary
                        : theme.colorMode === 'dark'
                          ? 'blue.900'
                          : 'blue.50'
                    }
                    borderRadius="lg"
                    gap={3}
                    align="start"
                  >
                    <Box
                      p={2}
                      borderRadius="full"
                      bg={
                        notif.type === 'warning'
                          ? 'orange.100'
                          : notif.type === 'success'
                            ? 'green.100'
                            : notif.type === 'error'
                              ? 'red.100'
                              : 'blue.100'
                      }
                    >
                      {notif.type === 'warning' ? (
                        <AlertCircle size={16} color="#dd6b20" />
                      ) : notif.type === 'success' ? (
                        <CheckCircle size={16} color="#38a169" />
                      ) : notif.type === 'error' ? (
                        <XCircle size={16} color="#e53e3e" />
                      ) : (
                        <Info size={16} color="#3182ce" />
                      )}
                    </Box>
                    <Box flex={1}>
                      <HStack gap={2} mb={1}>
                        <Text fontWeight="semibold" fontSize="sm" color={theme.textPrimary}>
                          {notif.title}
                        </Text>
                        {!notif.read && (
                          <Badge colorPalette="blue" size="sm">
                            Nova
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color={theme.textSecondary}>
                        {notif.message}
                      </Text>
                      <HStack mt={2} gap={3}>
                        <Text fontSize="xs" color={theme.textMuted}>
                          {new Date(notif.createdAt).toLocaleString('pt-BR')}
                        </Text>
                        {notif.createdBy && (
                          <Text fontSize="xs" color={theme.textMuted}>
                            por {notif.createdBy.name}
                          </Text>
                        )}
                        <Text fontSize="xs" color={theme.textMuted}>
                          → {notif.target ? notif.target.name : 'Todos'}
                        </Text>
                      </HStack>
                    </Box>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteNotification(notif.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </Flex>
                ))}
              </VStack>
            )}
          </Card.Body>
        </Card.Root>

        {/* Configurações Gerais */}
        <Card.Root
          bg={theme.bgCard}
          boxShadow="lg"
          borderRadius="xl"
          border="1px solid"
          borderColor={theme.borderColor}
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg={theme.colorMode === 'dark' ? 'blue.900' : 'blue.50'} p={3} borderRadius="lg">
                <Icon
                  as={Settings}
                  color={theme.colorMode === 'dark' ? 'blue.300' : 'blue.600'}
                  boxSize={6}
                />
              </Box>
              <Box>
                <Heading size="md" color={theme.textPrimary}>
                  Informações Gerais
                </Heading>
                <Text fontSize="sm" color={theme.textSecondary}>
                  Dados básicos da empresa
                </Text>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <FieldHelper label="Nome da Empresa" labelColor={theme.textSecondary}>
                <Input
                  value={nomeEmpresa}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNomeEmpresa(e.target.value)}
                  placeholder="Digite o nome da empresa"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>

              <FieldHelper label="Email de Suporte" labelColor={theme.textSecondary}>
                <Input
                  type="email"
                  value={emailSuporte}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmailSuporte(e.target.value)}
                  placeholder="email@exemplo.com"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>

              <FieldHelper label="Telefone de Contato" labelColor={theme.textSecondary}>
                <Input
                  value={telefone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        {/* Configurações de Comissões */}
        <Card.Root
          bg={theme.bgCard}
          boxShadow="lg"
          borderRadius="xl"
          border="1px solid"
          borderColor={theme.borderColor}
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box
                bg={theme.colorMode === 'dark' ? 'green.900' : 'green.50'}
                p={3}
                borderRadius="lg"
              >
                <Icon
                  as={DollarSign}
                  color={theme.colorMode === 'dark' ? 'green.300' : 'green.600'}
                  boxSize={6}
                />
              </Box>
              <Box>
                <Heading size="md" color={theme.textPrimary}>
                  Configurações de Comissões
                </Heading>
                <Text fontSize="sm" color={theme.textSecondary}>
                  Defina valores e regras para pagamento
                </Text>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <FieldHelper label="Valor da Comissão (R$)" labelColor={theme.textSecondary}>
                <Input
                  type="number"
                  value={valorComissao}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setValorComissao(e.target.value)}
                  placeholder="300"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>

              <FieldHelper label="Meta Mínima (%)" labelColor={theme.textSecondary}>
                <Input
                  type="number"
                  value={metaMinima}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setMetaMinima(e.target.value)}
                  placeholder="90"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>

              <FieldHelper label="Dia de Fechamento" labelColor={theme.textSecondary}>
                <Input
                  type="number"
                  value={diaFechamento}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDiaFechamento(e.target.value)}
                  placeholder="5"
                  min="1"
                  max="31"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        {/* Notificações */}
        <Card.Root
          bg={theme.bgCard}
          boxShadow="lg"
          borderRadius="xl"
          border="1px solid"
          borderColor={theme.borderColor}
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box
                bg={theme.colorMode === 'dark' ? 'purple.900' : 'purple.50'}
                p={3}
                borderRadius="lg"
              >
                <Icon
                  as={Bell}
                  color={theme.colorMode === 'dark' ? 'purple.300' : 'purple.600'}
                  boxSize={6}
                />
              </Box>
              <Box>
                <Heading size="md" color={theme.textPrimary}>
                  Notificações
                </Heading>
                <Text fontSize="sm" color={theme.textSecondary}>
                  Configure alertas e avisos do sistema
                </Text>
              </Box>
            </Flex>

            <Stack gap={4}>
              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg={theme.bgSecondary}
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color={theme.textPrimary}>
                    Notificações por Email
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Receber atualizações por email
                  </Text>
                </Box>
                <SwitchField
                  checked={emailNotifications}
                  onCheckedChange={(checked) => setEmailNotifications(checked)}
                  colorScheme="blue"
                />
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg={theme.bgSecondary}
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color={theme.textPrimary}>
                    Alertas de Performance
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Notificar quando metas não são atingidas
                  </Text>
                </Box>
                <SwitchField
                  checked={performanceAlerts}
                  onCheckedChange={(checked) => setPerformanceAlerts(checked)}
                  colorScheme="blue"
                />
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg={theme.bgSecondary}
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color={theme.textPrimary}>
                    Alertas de Pagamento
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Notificar sobre comissões aprovadas
                  </Text>
                </Box>
                <SwitchField
                  checked={paymentAlerts}
                  onCheckedChange={(checked) => setPaymentAlerts(checked)}
                  colorScheme="blue"
                />
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Segurança */}
        <Card.Root
          bg={theme.bgCard}
          boxShadow="lg"
          borderRadius="xl"
          border="1px solid"
          borderColor={theme.borderColor}
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg={theme.colorMode === 'dark' ? 'red.900' : 'red.50'} p={3} borderRadius="lg">
                <Icon
                  as={Shield}
                  color={theme.colorMode === 'dark' ? 'red.300' : 'red.600'}
                  boxSize={6}
                />
              </Box>
              <Box>
                <Heading size="md" color={theme.textPrimary}>
                  Segurança
                </Heading>
                <Text fontSize="sm" color={theme.textSecondary}>
                  Proteção e privacidade dos dados
                </Text>
              </Box>
            </Flex>

            <Stack gap={4}>
              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg={theme.bgSecondary}
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color={theme.textPrimary}>
                    Backup Automático
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Realizar backup diário dos dados
                  </Text>
                </Box>
                <SwitchField
                  checked={autoBackup}
                  onCheckedChange={(checked) => setAutoBackup(checked)}
                  colorScheme="green"
                />
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg={theme.bgSecondary}
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color={theme.textPrimary}>
                    Autenticação em Dois Fatores
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Adicionar camada extra de segurança
                  </Text>
                </Box>
                <SwitchField
                  checked={twoFactorAuth}
                  onCheckedChange={(checked) => setTwoFactorAuth(checked)}
                  colorScheme="green"
                />
              </Flex>

              <FieldHelper label="Timeout de Sessão (minutos)" labelColor={theme.textSecondary}>
                <Input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSessionTimeout(e.target.value)}
                  placeholder="30"
                  w={{ base: '100%', md: '300px' }}
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Usuários de Acesso */}
        <Card.Root
          bg={theme.bgCard}
          boxShadow="lg"
          borderRadius="xl"
          border="1px solid"
          borderColor={theme.borderColor}
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg={theme.colorMode === 'dark' ? 'blue.900' : 'blue.50'} p={3} borderRadius="lg">
                <Icon
                  as={UserPlus}
                  color={theme.colorMode === 'dark' ? 'blue.300' : 'blue.600'}
                  boxSize={6}
                />
              </Box>
              <Box>
                <Heading size="md" color={theme.textPrimary}>
                  Criar Novo Usuário
                </Heading>
                <Text fontSize="sm" color={theme.textSecondary}>
                  Adicione novos logins para acesso ao sistema
                </Text>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <FieldHelper label="Nome Completo" labelColor={theme.textSecondary}>
                <Input
                  value={userName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>

              <FieldHelper label="Email de Acesso" labelColor={theme.textSecondary}>
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value)}
                  placeholder="email@empresa.com"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>

              <FieldHelper label="Senha" labelColor={theme.textSecondary}>
                <Input
                  type="password"
                  value={userPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value)}
                  placeholder="Digite uma senha"
                  bg={theme.bgInput}
                  color={theme.textPrimary}
                  borderColor={theme.borderColor}
                />
              </FieldHelper>

              <FieldHelper label="Perfil de Acesso" labelColor={theme.textSecondary}>
                <select
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.bgInput,
                    color: theme.textPrimary,
                  }}
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </FieldHelper>
            </SimpleGrid>

            <Flex justify="flex-end" mt={6}>
              <Button colorScheme="blue" onClick={handleCreateUser} loading={creatingUser}>
                Criar Usuário
              </Button>
            </Flex>
          </Card.Body>
        </Card.Root>

        {/* Zona de Perigo */}
        <Card.Root
          bg={theme.bgCard}
          boxShadow="lg"
          borderRadius="xl"
          borderColor="red.500"
          borderWidth="2px"
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg={theme.colorMode === 'dark' ? 'red.900' : 'red.50'} p={3} borderRadius="lg">
                <Icon as={Database} color="red.500" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" color="red.500">
                  Zona de Perigo
                </Heading>
                <Text fontSize="sm" color={theme.textSecondary}>
                  Ações irreversíveis - use com cuidado
                </Text>
              </Box>
            </Flex>

            <Stack gap={4}>
              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg={theme.colorMode === 'dark' ? 'red.900' : 'red.50'}
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color={theme.textPrimary}>
                    Limpar Todos os Dados
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Remove supervisores, funcionários e métricas. Mantém administradores.
                  </Text>
                </Box>
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={() => setLimparDadosOpen(true)}
                >
                  Limpar Dados
                </Button>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg={theme.colorMode === 'dark' ? 'red.900' : 'red.50'}
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color={theme.textPrimary}>
                    Resetar Sistema
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Limpa tudo e volta às configurações iniciais. Apenas admins mantidos.
                  </Text>
                </Box>
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={() => setResetarSistemaOpen(true)}
                >
                  Resetar
                </Button>
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>
      </VStack>

      {/* Dialog: Confirmar exclusão de supervisor */}
      <Dialog.Root open={deleteConfirmOpen} onOpenChange={(e) => setDeleteConfirmOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.600" />
          <Dialog.Positioner>
            <Dialog.Content bg={theme.bgCard} borderRadius="xl" p={6} maxW="400px">
              <Dialog.Header>
                <HStack gap={3}>
                  <Box
                    bg={theme.colorMode === 'dark' ? 'red.900' : 'red.100'}
                    p={2}
                    borderRadius="full"
                  >
                    <AlertTriangle size={20} color="#E53E3E" />
                  </Box>
                  <Dialog.Title fontSize="lg" fontWeight="bold" color={theme.textPrimary}>
                    Confirmar Exclusão
                  </Dialog.Title>
                </HStack>
              </Dialog.Header>
              <Dialog.Body py={4}>
                <Text color={theme.textSecondary}>
                  Tem certeza que deseja excluir este supervisor? Esta ação não pode ser desfeita.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack justify="flex-end" gap={3}>
                  <Button
                    variant="ghost"
                    color={theme.textPrimary}
                    onClick={() => setDeleteConfirmOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDeleteSupervisor}
                    loading={actionLoading}
                  >
                    Excluir
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Dialog: Confirmar limpar dados */}
      <Dialog.Root open={limparDadosOpen} onOpenChange={(e) => setLimparDadosOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.600" />
          <Dialog.Positioner>
            <Dialog.Content bg={theme.bgCard} borderRadius="xl" p={6} maxW="450px">
              <Dialog.Header>
                <HStack gap={3}>
                  <Box
                    bg={theme.colorMode === 'dark' ? 'red.900' : 'red.100'}
                    p={2}
                    borderRadius="full"
                  >
                    <Database size={20} color="#E53E3E" />
                  </Box>
                  <Dialog.Title fontSize="lg" fontWeight="bold" color="red.500">
                    Limpar Todos os Dados
                  </Dialog.Title>
                </HStack>
              </Dialog.Header>
              <Dialog.Body py={4}>
                <Text color={theme.textSecondary} mb={3}>
                  Esta ação irá remover permanentemente:
                </Text>
                <VStack align="start" gap={1} pl={4}>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    • Todos os supervisores
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    • Todos os funcionários
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    • Todas as métricas e comissões
                  </Text>
                  <Text fontSize="sm" color={theme.textSecondary}>
                    • Todos os setores
                  </Text>
                </VStack>
                <Text color="green.500" fontWeight="medium" mt={3}>
                  ✓ Administradores serão mantidos
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack justify="flex-end" gap={3}>
                  <Button
                    variant="ghost"
                    color={theme.textPrimary}
                    onClick={() => setLimparDadosOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button colorScheme="red" onClick={handleLimparDados} loading={actionLoading}>
                    Confirmar Limpeza
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Dialog: Confirmar reset do sistema */}
      <Dialog.Root open={resetarSistemaOpen} onOpenChange={(e) => setResetarSistemaOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.600" />
          <Dialog.Positioner>
            <Dialog.Content bg={theme.bgCard} borderRadius="xl" p={6} maxW="450px">
              <Dialog.Header>
                <HStack gap={3}>
                  <Box
                    bg={theme.colorMode === 'dark' ? 'red.900' : 'red.100'}
                    p={2}
                    borderRadius="full"
                  >
                    <AlertTriangle size={20} color="#E53E3E" />
                  </Box>
                  <Dialog.Title fontSize="lg" fontWeight="bold" color="red.500">
                    Resetar Sistema Completo
                  </Dialog.Title>
                </HStack>
              </Dialog.Header>
              <Dialog.Body py={4}>
                <Text color={theme.textSecondary} mb={3}>
                  <strong>ATENÇÃO:</strong> Esta é a ação mais destrutiva do sistema!
                </Text>
                <Text color={theme.textSecondary} mb={3}>
                  Todos os dados serão apagados permanentemente, incluindo histórico de comissões.
                </Text>
                <Text color="green.500" fontWeight="medium">
                  ✓ Apenas administradores serão mantidos
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack justify="flex-end" gap={3}>
                  <Button
                    variant="ghost"
                    color={theme.textPrimary}
                    onClick={() => setResetarSistemaOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button colorScheme="red" onClick={handleResetarSistema} loading={actionLoading}>
                    Resetar Sistema
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
