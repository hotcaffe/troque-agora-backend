import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Proposal } from "./proposal.entity";
import { Category } from "../../category/entities/category.entity";

@Entity('itemProposta')
export class ProposalItem {
    @PrimaryGeneratedColumn()
    id_detalheProposta: number;
    
    @PrimaryColumn()
    id_usuarioProposta: number;

    @PrimaryColumn()
    id_propostaTroca: number;

    @Column({length: 64, nullable: false})
    vc_itemTitulo: string;

    @Column({length: 128, nullable: false})
    vc_descricao: string;

    @Column("numeric", {nullable: false, precision: 15})
    fl_quantidade: number;
    
    @Column({length: 4, nullable: false})
    ch_unidade: string;

    @Column({length: 32, nullable: false})
    vc_situacaoProduto: string;

    @Column({type: 'int4'})
    id_categoria: number

    @ManyToOne(() => Proposal, proposal => proposal.proposalItems)
    @JoinColumn([{name: 'id_usuarioProposta', referencedColumnName: 'id_usuarioProposta'}, {name: 'id_propostaTroca', referencedColumnName: 'id_propostaTroca'}])
    proposal: Proposal;

    @ManyToOne(() => Category, category => category.proposalItem)
    @JoinColumn({name: 'id_categoria'})
    category: Category;
}
