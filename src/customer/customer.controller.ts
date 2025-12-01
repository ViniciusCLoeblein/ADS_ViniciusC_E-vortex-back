import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { UserRequest } from '../generics/decorators/user-in-request.decorator';
import { Public } from '../generics/decorators/public-decorator';
import { UsuariosEntity } from '../entities/usuarios.entity';
import {
  EnderecoRes,
  ListaEnderecosRes,
  CartaoRes,
  ListaCartoesRes,
  ListaNotificacoesRes,
  PedidoDetalheRes,
  ListaPedidosRes,
  MessageRes,
  PedidosCriadosRes,
} from './types/customer.types';
import { CriarEnderecoDto } from './dto/criar-endereco.dto';
import { AtualizarEnderecoDto } from './dto/atualizar-endereco.dto';
import { CriarCartaoDto } from './dto/criar-cartao.dto';
import { CriarPedidoDto } from './dto/criar-pedido.dto';

@Controller('customer')
@ApiTags('Customer')
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @Get('perfil')
  obterPerfil(@UserRequest() user: UsuariosEntity) {
    return {
      id: user.id,
      uuid: user.uuid,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      tipo: user.tipo,
      telefone: user.telefone,
      emailVerificado: user.emailVerificado,
      pushToken: user.pushToken,
    };
  }

  @ApiOperation({ summary: 'Criar novo endereço' })
  @ApiOkResponse({ type: EnderecoRes })
  @Post('enderecos')
  @HttpCode(201)
  criarEndereco(
    @Body() body: CriarEnderecoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<EnderecoRes> {
    return this.customerService.criarEndereco({ ...body, usuarioId: user.id });
  }

  @ApiOperation({ summary: 'Listar endereços do usuário' })
  @ApiOkResponse({ type: ListaEnderecosRes })
  @Get('enderecos')
  listarEnderecos(
    @UserRequest() user: UsuariosEntity,
  ): Promise<ListaEnderecosRes> {
    return this.customerService.listarEnderecos(user.id);
  }

  @ApiOperation({ summary: 'Obter endereço por ID' })
  @ApiOkResponse({ type: EnderecoRes })
  @Get('enderecos/:id')
  obterEndereco(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<EnderecoRes> {
    return this.customerService.obterEndereco(id, user.id);
  }

  @ApiOperation({ summary: 'Atualizar endereço' })
  @ApiOkResponse({ type: EnderecoRes })
  @Put('enderecos/:id')
  atualizarEndereco(
    @Param('id') id: string,
    @Body() body: AtualizarEnderecoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<EnderecoRes> {
    return this.customerService.atualizarEndereco({
      id,
      usuarioId: user.id,
      ...body,
    });
  }

  @ApiOperation({ summary: 'Excluir endereço' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('enderecos/:id')
  excluirEndereco(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<MessageRes> {
    return this.customerService.excluirEndereco(id, user.id);
  }

  @ApiOperation({ summary: 'Listar endereços do vendedor' })
  @ApiOkResponse({ type: ListaEnderecosRes })
  @Public()
  @Get('enderecos/vendedor/:vendedorId')
  listarEnderecosVendedor(
    @Param('vendedorId') vendedorId: string,
  ): Promise<ListaEnderecosRes> {
    return this.customerService.listarEnderecosVendedor(vendedorId);
  }

  @ApiOperation({ summary: 'Adicionar cartão de crédito' })
  @ApiOkResponse({ type: CartaoRes })
  @Post('cartoes')
  @HttpCode(201)
  criarCartao(
    @Body() body: CriarCartaoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<CartaoRes> {
    return this.customerService.criarCartao({ ...body, usuarioId: user.id });
  }

  @ApiOperation({ summary: 'Listar cartões do usuário' })
  @ApiOkResponse({ type: ListaCartoesRes })
  @Get('cartoes')
  listarCartoes(@UserRequest() user: UsuariosEntity): Promise<ListaCartoesRes> {
    return this.customerService.listarCartoes(user.id);
  }

  @ApiOperation({ summary: 'Excluir cartão' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('cartoes/:id')
  excluirCartao(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<MessageRes> {
    return this.customerService.excluirCartao(id, user.id);
  }

  @ApiOperation({ summary: 'Listar notificações' })
  @ApiOkResponse({ type: ListaNotificacoesRes })
  @Get('notificacoes')
  listarNotificacoes(
    @UserRequest() user: UsuariosEntity,
  ): Promise<ListaNotificacoesRes> {
    return this.customerService.listarNotificacoes(user.id);
  }

  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiOkResponse({ type: MessageRes })
  @Put('notificacoes/:id/lida')
  marcarComoLida(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<MessageRes> {
    return this.customerService.marcarComoLida(id, user.id);
  }

  @ApiOperation({ summary: 'Criar pedido(s) - separado por vendedor' })
  @ApiOkResponse({ type: PedidosCriadosRes })
  @Post('pedidos')
  criarPedido(
    @Body() body: CriarPedidoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<PedidosCriadosRes> {
    return this.customerService.criarPedido({ ...body, usuarioId: user.id });
  }

  @ApiOperation({ summary: 'Listar pedidos do usuário' })
  @ApiOkResponse({ type: ListaPedidosRes })
  @Get('pedidos')
  listarPedidos(@UserRequest() user: UsuariosEntity): Promise<ListaPedidosRes> {
    return this.customerService.listarPedidos(user.id, user.tipo);
  }

  @ApiOperation({ summary: 'Obter detalhes do pedido' })
  @ApiOkResponse({ type: PedidoDetalheRes })
  @Get('pedidos/:id')
  obterPedido(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<PedidoDetalheRes> {
    return this.customerService.obterPedido(id, user.id, user.tipo);
  }
}
