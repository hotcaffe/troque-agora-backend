import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Proposal } from "./entities/proposal.entity";
import { ProposalItem } from "./entities/proposalItem.entity";
import { Repository } from "typeorm";
import { ProposalNotices } from "./entities/proposalNotices.entity";
import { FindProposalDTO } from "./dto/find-proposal-dto";
import { FindProposalNoticesReceivedDTO } from "./dto/find-proposal-notices-received-dto";
import { FindProposalNoticesSentDTO } from "./dto/find-proposal-notices-sent-dto";
import { CreateProposalDTO } from "./dto/create-proposal-dto";


@Injectable()
export class ProposalService {
    constructor(
        @InjectRepository(Proposal) private readonly proposalRepository: Repository<Proposal>,
        @InjectRepository(ProposalItem) private readonly proposalItemRepository: Repository<ProposalItem>,
        @InjectRepository(ProposalNotices) private readonly proposalNoticesRepository: Repository<ProposalNotices>
    ){}

    async findOne(id_propostaTroca: number, id_usuarioProposta: number, relations?: string) {
        const _relations = relations?.split(',')?.map(rel => ({[rel.trim()]: true})) || [];
        const {proposalItems, proposalNotices, user} = Object.assign({proposalItems: false, proposalNotices: false, user: false}, ..._relations)

        return await this.proposalRepository.findOne({
            where: {
                id_propostaTroca,
                id_usuarioProposta
            },
            relations: {
                proposalItems,
                proposalNotices,
                user
            }
        })
    }

    async find(id_usuarioProposta: number, where: FindProposalDTO, page?: number, take?: number, relations?: string) {
        const _relations = relations?.split(',')?.map(rel => ({[rel.trim()]: true})) || [];
        const {proposalItems, proposalNotices, proposalNoticesDetails, user} = Object.assign({proposalItems: false, proposalNotices: false, proposalNoticesDetails: false, user: false}, ..._relations)

        if (!page || (page - 1) < 0) {
            page = 0
        } else {
            page = page - 1
        }
        if (!take) take = 100

        return await this.proposalRepository.find({
            where: {
                ...where,
                id_usuarioProposta
            },
            take,
            skip: (page * take),
            relations: {
                proposalItems,
                proposalNotices: proposalNotices && {
                    notice: proposalNoticesDetails && {
                        user: true,
                        noticeDetails: true
                    }
                },
                user
            }
        });
    }

    async findReceived(id_usuarioAnuncio: number, where: FindProposalNoticesReceivedDTO, page?: number, take?: number, relations?: string) {
        const _relations = relations?.split(',')?.map(rel => ({[rel.trim()]: true})) || [];
        const {proposal, proposalDetails, notice, noticeDetails} = Object.assign({proposal: false, notice: false}, ..._relations)

        if (!page || (page - 1) < 0) {
            page = 0
        } else {
            page = page - 1
        }
        if (!take) take = 100

        return await this.proposalNoticesRepository.find({
            where: {
                ...where,
                id_usuarioAnuncio
            },
            relations: {
                proposal: proposal && {
                    proposalItems: proposalDetails,
                    user: proposalDetails
                },
                notice: notice && {
                    noticeDetails: noticeDetails
                }
            }
        })
    }

    async findSent(id_usuarioProposta: number, where: FindProposalNoticesSentDTO, page?: number, take?: number, relations?: string) {
        const _relations = relations?.split(',')?.map(rel => ({[rel.trim()]: true})) || [];
        const {proposal, proposalDetails, notice, noticeDetails} = Object.assign({proposal: false, proposalDetails: false, notice: false, noticeDetails: false}, ..._relations)

        if (!page || (page - 1) < 0) {
            page = 0
        } else {
            page = page - 1
        }
        if (!take) take = 100
        
        return await this.proposalNoticesRepository.find({
            where: {
                ...where,
                id_usuarioProposta
            },
            relations: {
                proposal: proposal && {
                    proposalItems: proposalDetails
                },
                notice: notice && {
                    noticeDetails: noticeDetails,
                    user: noticeDetails
                }
            }
        })
    }

    async cancel(id_usuarioProposta: number, id_propostaTroca: number) {
        const proposalNotices = await this.proposalNoticesRepository.find({
            where: {
                id_usuarioProposta,
                id_propostaTroca
            }
        });

        if (proposalNotices.length == 0) throw new HttpException("Proposta não encontrada!", 404)

        const pendingProposalNotices = proposalNotices?.filter(item => item.vc_status == 'pending');
        const canceledProposalNotices = proposalNotices?.filter(item => item.vc_status == 'canceled');

        if (canceledProposalNotices.length == proposalNotices.length) {
            throw new HttpException('Essa proposta já foi inteiramente cancelada!', 400)
        }

        if (pendingProposalNotices.length == 0) {
            throw new HttpException('Essa proposta não pode ser cancelada, pois todos os anunciantes envolvidos já aceitaram ou recusaram a oferta!', 400)
        }

        if (pendingProposalNotices.length == proposalNotices.length) {
            await this.proposalNoticesRepository.update({
                id_usuarioProposta, 
                id_propostaTroca
            }, {
                vc_status: 'canceled'
            });
            
            await this.proposalRepository.update({id_usuarioProposta, id_propostaTroca}, {
                bo_ativo: false
            });

            return {success: "A proposta foi inteiramente cancelada!"}
        } else {
            pendingProposalNotices.forEach(async (item) => {
                await this.proposalNoticesRepository.update(item, {
                    vc_status: 'canceled'
                })
            })

            return {success: "Apenas os itens pendentes foram cancelados!"}
        }
    }

    async relateTo(id_usuarioProposta: number, proposal: CreateProposalDTO) {
        const sameUser = proposal.proposalNotices.some(item => item.id_usuarioAnuncio == id_usuarioProposta);

        if (sameUser) throw new HttpException("Você não pode realizar uma proposta de troca em um anúncio que pertence a você mesmo!", 400);

        return await this.proposalRepository.save({...proposal, id_usuarioProposta})
    }

    async accept(id_anuncioTroca: number, id_usuarioAnuncio: number, id_propostaTroca: number, id_usuarioProposta: number) {
        const proposalNotice = await this.proposalNoticesRepository.findOne({
            where: {
                id_anuncioTroca,
                id_usuarioAnuncio,
                id_propostaTroca,
                id_usuarioProposta
            }
        })

        if (proposalNotice.vc_status == 'canceled') {
            throw new HttpException('Essa proposta foi cancelada pelo interessado, portanto não poderá ser aceitada!', 400)            
        }

        if (proposalNotice.vc_status == 'accepted') {
            throw new HttpException('Essa proposta já foi aceita!', 400)            
        }

        if (proposalNotice.vc_status == 'rejected') {
            throw new HttpException('Essa proposta já foi rejeitada!', 400)            
        }

        if (proposalNotice.vc_status == 'finished') {
            throw new HttpException('Essa proposta já foi finalizada!', 400)            
        }

        return await this.proposalNoticesRepository.update({
            id_anuncioTroca,
            id_usuarioAnuncio,
            id_propostaTroca,
            id_usuarioProposta
        }, {
            vc_status: 'accepted'
        })
    }

    async reject(id_anuncioTroca: number, id_usuarioAnuncio: number, id_propostaTroca: number, id_usuarioProposta: number) {
        const proposalNotice = await this.proposalNoticesRepository.findOne({
            where: {
                id_anuncioTroca,
                id_usuarioAnuncio,
                id_propostaTroca,
                id_usuarioProposta
            }
        })

        if (!proposalNotice) throw new HttpException('Proposta não encontrada!', 404) 

        if (proposalNotice.vc_status == 'canceled') {
            throw new HttpException('Essa proposta foi cancelada pelo interessado, portanto não poderá ser rejeitada!', 400)            
        }

        if (proposalNotice.vc_status == 'accepted') {
            throw new HttpException('Essa proposta já foi aceita!', 400)            
        }

        if (proposalNotice.vc_status == 'rejected') {
            throw new HttpException('Essa proposta já foi rejeitada!', 400)            
        }

        if (proposalNotice.vc_status == 'finished') {
            throw new HttpException('Essa proposta já foi finalizada!', 400)            
        }

        return await this.proposalNoticesRepository.update({
            id_anuncioTroca,
            id_usuarioAnuncio,
            id_propostaTroca,
            id_usuarioProposta
        }, {
            vc_status: 'rejected'
        })
    }
}