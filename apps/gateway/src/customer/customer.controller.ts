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
import { Observable } from 'rxjs';
import { UserRequest } from 'apps/generics/decorators/user-in-request.decorator';
import { UsuariosEntity } from 'apps/entities/usuarios.entity';
import {
  EnderecoRes,
  ListaEnderecosRes,
  CartaoRes,
  ListaCartoesRes,
  ListaNotificacoesRes,
  PedidoDetalheRes,
  ListaPedidosRes,
  MessageRes,
} from './types/customer.types';
import { CriarEnderecoDto } from './dto/criar-endereco.dto';
import { AtualizarEnderecoDto } from './dto/atualizar-endereco.dto';
import { CriarCartaoDto } from './dto/criar-cartao.dto';

@Controller('customer')
@ApiTags('Customer')
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Endereços
  @ApiOperation({ summary: 'Criar novo endereço' })
  @ApiOkResponse({ type: EnderecoRes })
  @Post('enderecos')
  @HttpCode(201)
  criarEndereco(
    @Body() body: CriarEnderecoDto,
    @UserRequest() user: UsuariosEntity,
  ): Observable<EnderecoRes> {
    return this.customerService.criarEndereco(user.id, body);
  }

  @ApiOperation({ summary: 'Listar endereços do usuário' })
  @ApiOkResponse({ type: ListaEnderecosRes })
  @Get('enderecos')
  listarEnderecos(
    @UserRequest() user: UsuariosEntity,
  ): Observable<ListaEnderecosRes> {
    return this.customerService.listarEnderecos(user.id);
  }

  @ApiOperation({ summary: 'Obter endereço por ID' })
  @ApiOkResponse({ type: EnderecoRes })
  @Get('enderecos/:id')
  obterEndereco(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<EnderecoRes> {
    return this.customerService.obterEndereco(id, user.id);
  }

  @ApiOperation({ summary: 'Atualizar endereço' })
  @ApiOkResponse({ type: EnderecoRes })
  @Put('enderecos/:id')
  atualizarEndereco(
    @Param('id') id: string,
    @Body() body: AtualizarEnderecoDto,
    @UserRequest() user: UsuariosEntity,
  ): Observable<EnderecoRes> {
    return this.customerService.atualizarEndereco(id, user.id, body);
  }

  @ApiOperation({ summary: 'Excluir endereço' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('enderecos/:id')
  excluirEndereco(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<MessageRes> {
    return this.customerService.excluirEndereco(id, user.id);
  }

  // Cartões
  @ApiOperation({ summary: 'Adicionar cartão de crédito' })
  @ApiOkResponse({ type: CartaoRes })
  @Post('cartoes')
  @HttpCode(201)
  criarCartao(
    @Body() body: CriarCartaoDto,
    @UserRequest() user: UsuariosEntity,
  ): Observable<CartaoRes> {
    return this.customerService.criarCartao(user.id, body);
  }

  @ApiOperation({ summary: 'Listar cartões do usuário' })
  @ApiOkResponse({ type: ListaCartoesRes })
  @Get('cartoes')
  listarCartoes(
    @UserRequest() user: UsuariosEntity,
  ): Observable<ListaCartoesRes> {
    return this.customerService.listarCartoes(user.id);
  }

  @ApiOperation({ summary: 'Excluir cartão' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('cartoes/:id')
  excluirCartao(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<MessageRes> {
    return this.customerService.excluirCartao(id, user.id);
  }

  // Notificações
  @ApiOperation({ summary: 'Listar notificações' })
  @ApiOkResponse({ type: ListaNotificacoesRes })
  @Get('notificacoes')
  listarNotificacoes(
    @UserRequest() user: UsuariosEntity,
  ): Observable<ListaNotificacoesRes> {
    return this.customerService.listarNotificacoes(user.id);
  }

  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiOkResponse({ type: MessageRes })
  @Put('notificacoes/:id/lida')
  marcarComoLida(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<MessageRes> {
    return this.customerService.marcarComoLida(id, user.id);
  }

  // Pedidos
  @ApiOperation({ summary: 'Listar pedidos do usuário' })
  @ApiOkResponse({ type: ListaPedidosRes })
  @Get('pedidos')
  listarPedidos(
    @UserRequest() user: UsuariosEntity,
  ): Observable<ListaPedidosRes> {
    return this.customerService.listarPedidos(user.id);
  }

  @ApiOperation({ summary: 'Obter detalhes do pedido' })
  @ApiOkResponse({ type: PedidoDetalheRes })
  @Get('pedidos/:id')
  obterPedido(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<PedidoDetalheRes> {
    return this.customerService.obterPedido(id, user.id);
  }
}

