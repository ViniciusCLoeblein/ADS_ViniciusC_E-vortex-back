import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { Observable } from 'rxjs';
import { AdicionarItemCarrinhoDto } from './dto/adicionar-item-carrinho.dto';
import { AtualizarItemCarrinhoDto } from './dto/atualizar-item-carrinho.dto';
import { UserRequest } from 'apps/generics/decorators/user-in-request.decorator';
import { UsuariosEntity } from 'apps/entities/usuarios.entity';
import {
  CarrinhoRes,
  FavoritosRes,
  MessageRes,
  ProdutoDetalheRes,
  ProdutoListagemRes,
} from './types/sales.types';

@Controller('sales')
@ApiTags('Sales')
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @ApiOperation({ summary: 'Obter carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Get('carrinho')
  obterCarrinho(@UserRequest() user: UsuariosEntity): Observable<CarrinhoRes> {
    return this.salesService.obterCarrinho(user);
  }

  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Post('carrinho/itens')
  @HttpCode(200)
  adicionarItemCarrinho(
    @Body() body: AdicionarItemCarrinhoDto,
    @UserRequest() user: UsuariosEntity,
  ): Observable<CarrinhoRes> {
    return this.salesService.adicionarItemCarrinho(user.id, body);
  }

  @ApiOperation({ summary: 'Atualizar item do carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Put('carrinho/itens/:itemId')
  atualizarItemCarrinho(
    @Param('itemId') itemId: string,
    @Body() body: AtualizarItemCarrinhoDto,
    @UserRequest() user: UsuariosEntity,
  ): Observable<CarrinhoRes> {
    return this.salesService.atualizarItemCarrinho(
      user.id,
      itemId,
      body.quantidade,
    );
  }

  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Delete('carrinho/itens/:itemId')
  removerItemCarrinho(
    @Param('itemId') itemId: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<CarrinhoRes> {
    return this.salesService.removerItemCarrinho(user.id, itemId);
  }

  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('carrinho')
  limparCarrinho(@UserRequest() user: UsuariosEntity): Observable<MessageRes> {
    return this.salesService.limparCarrinho(user.id);
  }

  @ApiOperation({ summary: 'Listar produtos' })
  @ApiOkResponse({ type: ProdutoListagemRes })
  @Get('produtos')
  listarProdutos(
    @Query('categoriaId') categoriaId?: string,
    @Query('busca') busca?: string,
    @Query('pagina') pagina?: number,
    @Query('limite') limite?: number,
  ): Observable<ProdutoListagemRes> {
    return this.salesService.listarProdutos({
      categoriaId,
      busca,
      pagina: pagina ? Number(pagina) : undefined,
      limite: limite ? Number(limite) : undefined,
    });
  }

  @ApiOperation({ summary: 'Obter produto' })
  @ApiOkResponse({ type: ProdutoDetalheRes })
  @Get('produtos/:id')
  obterProduto(@Param('id') id: string): Observable<ProdutoDetalheRes> {
    return this.salesService.obterProduto(id);
  }

  @ApiOperation({ summary: 'Listar favoritos' })
  @ApiOkResponse({ type: FavoritosRes })
  @Get('favoritos')
  listarFavoritos(
    @UserRequest() user: UsuariosEntity,
  ): Observable<FavoritosRes> {
    return this.salesService.listarFavoritos(user.id);
  }

  @ApiOperation({ summary: 'Adicionar produto aos favoritos' })
  @ApiOkResponse({ type: MessageRes })
  @Post('favoritos/:produtoId')
  @HttpCode(200)
  adicionarFavorito(
    @Param('produtoId') produtoId: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<MessageRes> {
    return this.salesService.adicionarFavorito(user.id, produtoId);
  }

  @ApiOperation({ summary: 'Remover produto dos favoritos' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('favoritos/:produtoId')
  removerFavorito(
    @Param('produtoId') produtoId: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<MessageRes> {
    return this.salesService.removerFavorito(user.id, produtoId);
  }
}
