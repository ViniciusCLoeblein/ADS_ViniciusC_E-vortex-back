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
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { Observable } from 'rxjs';
import { Public } from 'apps/generics/decorators/public-decorator';
import { AdicionarItemCarrinhoDto } from './dto/adicionar-item-carrinho.dto';
import { AtualizarItemCarrinhoDto } from './dto/atualizar-item-carrinho.dto';

@Controller('sales')
@ApiTags('Sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // Carrinho
  @ApiOperation({ summary: 'Obter carrinho' })
  @Get('carrinho')
  @Public()
  obterCarrinho(
    @Query('sessaoId') sessaoId?: string,
    @Req() req?: any,
  ): Observable<any> {
    const usuarioId = req?.user?.sub;
    return this.salesService.obterCarrinho({ usuarioId, sessaoId });
  }

  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @Post('carrinho/itens')
  @Public()
  @HttpCode(200)
  adicionarItemCarrinho(
    @Body() body: AdicionarItemCarrinhoDto,
    @Req() req?: any,
  ): Observable<any> {
    const usuarioId = req?.user?.sub;
    return this.salesService.adicionarItemCarrinho({
      ...body,
      usuarioId,
    });
  }

  @ApiOperation({ summary: 'Atualizar item do carrinho' })
  @Put('carrinho/itens/:itemId')
  @Public()
  atualizarItemCarrinho(
    @Param('itemId') itemId: string,
    @Body() body: AtualizarItemCarrinhoDto,
    @Req() req?: any,
  ): Observable<any> {
    const usuarioId = req?.user?.sub;
    return this.salesService.atualizarItemCarrinho({
      itemId,
      quantidade: body.quantidade,
      usuarioId,
      sessaoId: body.sessaoId,
    });
  }

  @ApiOperation({ summary: 'Remover item do carrinho' })
  @Delete('carrinho/itens/:itemId')
  @Public()
  removerItemCarrinho(
    @Param('itemId') itemId: string,
    @Query('sessaoId') sessaoId?: string,
    @Req() req?: any,
  ): Observable<any> {
    const usuarioId = req?.user?.sub;
    return this.salesService.removerItemCarrinho({
      itemId,
      usuarioId,
      sessaoId,
    });
  }

  @ApiOperation({ summary: 'Limpar carrinho' })
  @Delete('carrinho')
  @Public()
  limparCarrinho(
    @Query('sessaoId') sessaoId?: string,
    @Req() req?: any,
  ): Observable<any> {
    const usuarioId = req?.user?.sub;
    return this.salesService.limparCarrinho({ usuarioId, sessaoId });
  }

  // Produtos
  @ApiOperation({ summary: 'Listar produtos' })
  @Get('produtos')
  @Public()
  listarProdutos(
    @Query('categoriaId') categoriaId?: string,
    @Query('busca') busca?: string,
    @Query('pagina') pagina?: number,
    @Query('limite') limite?: number,
  ): Observable<any> {
    return this.salesService.listarProdutos({
      categoriaId,
      busca,
      pagina: pagina ? Number(pagina) : undefined,
      limite: limite ? Number(limite) : undefined,
    });
  }

  @ApiOperation({ summary: 'Obter produto' })
  @Get('produtos/:id')
  @Public()
  obterProduto(@Param('id') id: string): Observable<any> {
    return this.salesService.obterProduto(id);
  }

  // Favoritos
  @ApiOperation({ summary: 'Listar favoritos' })
  @Get('favoritos')
  listarFavoritos(@Req() req: any): Observable<any> {
    const usuarioId = req.user?.sub;
    return this.salesService.listarFavoritos(usuarioId);
  }

  @ApiOperation({ summary: 'Adicionar produto aos favoritos' })
  @Post('favoritos/:produtoId')
  @HttpCode(200)
  adicionarFavorito(
    @Param('produtoId') produtoId: string,
    @Req() req: any,
  ): Observable<any> {
    const usuarioId = req.user?.sub;
    return this.salesService.adicionarFavorito({ usuarioId, produtoId });
  }

  @ApiOperation({ summary: 'Remover produto dos favoritos' })
  @Delete('favoritos/:produtoId')
  removerFavorito(
    @Param('produtoId') produtoId: string,
    @Req() req: any,
  ): Observable<any> {
    const usuarioId = req.user?.sub;
    return this.salesService.removerFavorito({ usuarioId, produtoId });
  }
}
