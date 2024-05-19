import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VolunteeringSectionDto } from "./dto/volunteering_section.dto";
import { VolunteeringSection } from "src/schemas/volunteering_opportunity.schema";
import { ModelUnprocessableEnitityException } from "src/core/error/exception";
import { ERROR_MESSAGES } from "src/core/constants/error_message";

@Injectable()
export class VolunteeringSectionService {
    constructor(@InjectModel(VolunteeringSection.name) private volunteeringSectionModel: Model<VolunteeringSection>
    ) { }

    async createdVolunteeringSection(createdVolunteeringSectionDto: VolunteeringSectionDto): Promise<VolunteeringSection> {
        const createdVolunteeringSection = new this.volunteeringSectionModel(createdVolunteeringSectionDto);
        return createdVolunteeringSection.save();

    }


    async deleteVolunteeringSection(id: string): Promise<void> {
        const deletedVolunteeringSection = await this.volunteeringSectionModel.findOneAndDelete({ _id: id });

        if (!deletedVolunteeringSection) throw new ModelUnprocessableEnitityException(ERROR_MESSAGES.VOLUNTEERING_SECTION_NOT_FOUND);
    }


    async updateVolunteeringSection(id: string, updatedVolunteeringSectionDto: VolunteeringSectionDto): Promise<VolunteeringSection> {
        const updatedVolunteeringSection = await this.volunteeringSectionModel.findByIdAndUpdate(id, updatedVolunteeringSectionDto, { new: true });

        if (!updatedVolunteeringSection) throw new ModelUnprocessableEnitityException(ERROR_MESSAGES.VOLUNTEERING_SECTION_NOT_FOUND);
        return updatedVolunteeringSection;
    }


    async getAllVolunteeringOpportunities(): Promise<VolunteeringSection[]> {
        return this.volunteeringSectionModel.find();
    }
}